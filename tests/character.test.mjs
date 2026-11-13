import assert from "node:assert/strict";
import { test } from "node:test";
import { identitySchema, favoriteSchema, searchQuerySchema, officialEquipmentSchema, officialInfoSchema, officialItemSchema, officialSearchSchema, equipmentQuerySchema } from "../domains/character/contracts.ts";
import { normalizeEquipmentDetails, normalizeProfile, normalizeSearch, safeImage } from "../domains/character/normalizers.ts";
import { createQueryCache } from "../domains/character/services/query-cache.ts";
import { formatEquipmentStat, getGearReference, isCurrentBinding, parseGearMode } from "../domains/character/services/gear-reference.ts";
import pvpSnapshot from "../domains/character/data/pvp-reference.json" with { type: "json" };
import { calculateGearRating, rankFromScore } from "../domains/character/services/gear-rating.ts";
import { parseEquipmentView, resolveCardMode } from "../domains/character/services/equipment-view.ts";
import { requestEquipmentDetails } from "../domains/character/services/equipment-client.ts";

const identity = { region: "la", serverId: 2403, characterId: "character-key=" };
const info = {
  profile: { characterId: identity.characterId, characterName: "Hadamiri", characterLevel: 45, serverId: 2403, serverName: "Triniel", className: "Templar", raceId: 2, combatPower: 157482 },
  stat: { statList: [{ name: "Item level", type: "ItemLevel", value: 2770, statSecondList: null }, { name: "Might", type: "STR", value: 32, statSecondList: ["Attack increase +3.2%"] }] },
};
const item = { id: 310230053, name: "Enraged Kromede Earrings", slotPos: 11, slotPosName: "Earring1", grade: "Unique", enchantLevel: 14, exceedLevel: 0 };

test("validates region, server, query length and page before calling the armory", () => {
  assert.equal(searchQuerySchema.safeParse({ region: "la", name: "  Hadamiri  ", serverId: "2403" }).data.name, "Hadamiri");
  for (const query of [{ region: "invalid", name: "Test" }, { region: "la", name: "x" }, { region: "la", name: "<script>" }, { region: "la", name: "Test", serverId: "https://example.com" }, { region: "la", name: "Test", page: 0 }]) {
    assert.equal(searchQuerySchema.safeParse(query).success, false);
  }
});

test("canonicalizes encoded character IDs once and rejects malformed identities", () => {
  assert.deepEqual(identitySchema.parse({ ...identity, serverId: "2403", characterId: "character-key%3D" }), identity);
  assert.equal(new URLSearchParams(identitySchema.parse(identity)).get("characterId"), "character-key=");
  assert.equal(identitySchema.safeParse({ ...identity, characterId: "%broken" }).success, false);
  assert.equal(identitySchema.safeParse({ ...identity, characterId: "https://example.com/" }).success, false);
});

test("validates stored favorites, including their identity", () => {
  assert.equal(favoriteSchema.safeParse({ ...identity, name: "Hadamiri", serverName: "Triniel" }).success, true);
  assert.equal(favoriteSchema.safeParse({ ...identity, name: "Hadamiri" }).success, false);
});

test("normalizes official search highlights and relative profile images", () => {
  const source = officialSearchSchema.parse({ list: [{ characterId: "character-key%3D", name: "<strong>Hadamiri</strong>", serverId: 2403, serverName: "Triniel", level: 45, race: 2, profileImageUrl: "/game_profile_images/aion2global/images?charKey=123" }], pagination: { page: 1, total: 1, endPage: 1 } });
  const result = normalizeSearch(source, "la");
  assert.equal(result.characters[0].name, "Hadamiri");
  assert.equal(result.characters[0].characterId, identity.characterId);
  assert.equal(result.characters[0].image, "https://profileimg.plaync.com/game_profile_images/aion2global/images?charKey=123");
  assert.equal(result.characters[0].region, "la");
});

test("handles empty search results without inventing a character", () => {
  const result = normalizeSearch(officialSearchSchema.parse({ list: null, pagination: { page: 1, total: 0, endPage: 0 } }), "la");
  assert.deepEqual(result.characters, []);
  assert.equal(result.total, 0);
});

test("accepts only HTTPS images hosted by the official image domains", () => {
  assert.ok(safeImage("https://assets.playnccdn.com/item.png"));
  for (const value of ["javascript:alert(1)", "http://assets.playnccdn.com/item.png", "https://playnccdn.com.evil.test/item.png", "//evil.test/item.png", "https://user:pass@assets.playnccdn.com/item.png"]) assert.equal(safeImage(value), null);
});

test("preserves duplicate item IDs in different slots and groups equipment", () => {
  const gear = officialEquipmentSchema.parse({ equipment: { equipmentList: [item, { ...item, slotPos: 12, slotPosName: "Earring2" }, { ...item, slotPos: 1, slotPosName: "MainHand", enchantLevel: 15, exceedLevel: 1 }, { ...item, slotPos: 41, slotPosName: "Arcana1" }] } });
  const result = normalizeProfile(officialInfoSchema.parse(info), gear, identity);
  assert.equal(result.equipment.length, 4);
  assert.deepEqual(result.equipment.map((entry) => entry.slot), [1, 11, 12, 41]);
  assert.deepEqual(result.equipment.map((entry) => entry.group), ["weapons", "accessories", "accessories", "arcana"]);
  assert.equal(result.equipment[0].exceedLevel, 1);
  assert.equal(result.itemLevel, 2770);
  assert.equal(result.stats.length, 1);
  assert.deepEqual(result.stats[0].bonuses, ["Attack increase +3.2%"]);
});

test("keeps absent combat power distinct from zero and supports unequipped profiles", () => {
  const source = structuredClone(info);
  delete source.profile.combatPower;
  source.stat.statList = null;
  const result = normalizeProfile(officialInfoSchema.parse(source), officialEquipmentSchema.parse({ equipment: { equipmentList: null } }), identity);
  assert.equal(result.combatPower, null);
  assert.equal(result.itemLevel, null);
  assert.deepEqual(result.equipment, []);
  assert.deepEqual(result.stats, []);
});

test("rejects incompatible upstream payloads instead of silently hiding a schema change", () => {
  assert.equal(officialInfoSchema.safeParse({ profile: null }).success, false);
  assert.equal(officialEquipmentSchema.safeParse({ equipment: {} }).success, false);
  assert.equal(officialSearchSchema.safeParse({ list: [] }).success, false);
});

test("deduplicates concurrent requests and expires cache entries", async () => {
  let time = 0;
  let calls = 0;
  const cache = createQueryCache(2, () => time);
  const load = async () => ++calls;
  assert.deepEqual(await Promise.all([cache.get("a", 100, load), cache.get("a", 100, load)]), [1, 1]);
  assert.equal(await cache.get("a", 100, load), 1);
  time = 101;
  assert.equal(await cache.get("a", 100, load), 2);
});

test("failed lookups are not cached and the number of cached entries stays bounded", async () => {
  const cache = createQueryCache(1);
  await assert.rejects(cache.get("a", 1000, async () => { throw new Error("offline"); }));
  assert.equal(await cache.get("a", 1000, async () => 1), 1);
  await cache.get("b", 1000, async () => 2);
  assert.equal(await cache.get("a", 1000, async () => 3), 3);
});

test("equipment detail queries require the actual slot and item ID", () => {
  assert.equal(equipmentQuerySchema.safeParse({ ...identity, slot: "11", itemId: "310230053" }).success, true);
  for (const extra of [{ slot: 0, itemId: 1 }, { slot: 11, itemId: -1 }, { slot: 1.5, itemId: 1 }, { slot: 11, itemId: "https://example.com" }]) assert.equal(equipmentQuerySchema.safeParse({ ...identity, ...extra }).success, false);
});

test("normalizes real equipped stat shapes, numeric values, skills and empty sections", () => {
  const result = normalizeEquipmentDetails(officialItemSchema.parse({
    id: 110230051, name: "Enraged Kromede Sword", soulBindRate: "49",
    mainStats: [{ id: "WeaponFixingDamage", name: "Attack", minValue: "354", value: "442", extra: "146" }],
    subStats: [{ id: "STR", name: "Might", value: 24 }],
    subSkills: [{ id: 12240000, name: "Judgment", level: 1 }], magicStoneStat: null,
  }));
  assert.equal(formatEquipmentStat(result.mainStats[0]), "354–442 (+146)");
  assert.equal(formatEquipmentStat({ ...result.mainStats[0], minValue: null, extra: "0" }), "442");
  assert.equal(formatEquipmentStat({ ...result.mainStats[0], minValue: null, extra: "-2" }), "442 (-2)");
  assert.equal(result.subStats[0].value, "24");
  assert.equal(result.skills[0].level, "1");
  assert.deepEqual(result.stones, []);
  assert.equal(result.soulBindRate, "49");
  assert.equal(officialItemSchema.safeParse({ id: 1, name: "Missing stats" }).success, false);
});

test("uses actual class and equipment slot, preserving differences between classes", () => {
  const templar = getGearReference("Templar", 5);
  const ranger = getGearReference("Ranger", 5);
  assert.equal(templar.status, "available");
  assert.equal(templar.classLabel, "Templário");
  assert.ok(templar.options.some((option) => option.name === "Block"));
  assert.ok(ranger.options.some((option) => option.name === "Critical Hit"));
  assert.notDeepEqual(templar.options, ranger.options);
  assert.equal(getGearReference("Templar", 8).options[0].name, "Move Speed");
  assert.deepEqual(getGearReference("Templar", 11), getGearReference("Templar", 12));
  assert.deepEqual(getGearReference("Templar", 13), getGearReference("Templar", 14));
});

test("does not invent recommendations for unknown classes, runes, belts or Arcanas", () => {
  assert.equal(getGearReference("Unknown", 1).status, "unknown-class");
  assert.equal(getGearReference("__proto__", 1).status, "unknown-class");
  assert.equal(getGearReference("constructor", 1).classLabel, "constructor");
  for (const slot of [17, 22, 23, 24, 41, 42, 45, 99]) {
    assert.equal(getGearReference("Templar", slot).status, "unknown-slot");
    assert.deepEqual(getGearReference("Templar", slot).options, []);
  }
});

test("all nine supported class references contain valid descending sample percentages", () => {
  for (const className of ["Gladiator", "Templar", "Assassin", "Ranger", "Sorcerer", "Spiritmaster", "Cleric", "Chanter", "Fighter"]) {
    for (const slot of [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 15, 19]) {
      const guide = getGearReference(className, slot);
      assert.equal(guide.status, "available");
      assert.ok(guide.sampleSize > 0);
      assert.ok(guide.options.length >= 3);
      guide.options.forEach((option, index) => {
        assert.ok(option.name && option.share >= 0 && option.share <= 100);
        if (index > 0) assert.ok(guide.options[index - 1].share >= option.share);
      });
    }
  }
});

test("only marks a recommendation present when it is actually in the soul-binding lines", () => {
  const result = normalizeEquipmentDetails(officialItemSchema.parse({
    id: 1, name: "Sword", mainStats: [{ id: "Attack", name: "Attack", value: "100" }],
    subStats: [{ id: "STR", name: "Might", value: "24" }],
    magicStoneStat: [{ id: "Block", name: "Block", value: "+15" }],
  }));
  assert.equal(isCurrentBinding("Might", result), true);
  assert.equal(isCurrentBinding("Attack", result), false);
  assert.equal(isCurrentBinding("Block", result), false);
});

test("PvP uses its own source and stat priorities instead of the PvE sample", () => {
  const pve = getGearReference("Templar", 8, "pve");
  const pvp = getGearReference("Templar", 8, "pvp");
  assert.notDeepEqual(pve.options, pvp.options);
  assert.equal(pvp.mode, "pvp");
  assert.equal(pvp.source.label, "Cielui");
  assert.equal(pvp.source.sampleDate, null);
  assert.ok(pvp.options.some((option) => option.id === "AbnormalResistance"));
  assert.equal(pve.options.some((option) => option.name === "Status Effect Resist"), false);
});

test("PvP adoption percentages use the actual slot sample rather than the class total", () => {
  const boots = pvpSnapshot.classes.templar.slots.Boots;
  const expected = Math.round(boots.options[0][2] / boots.sampleSize * 1000) / 10;
  const guide = getGearReference("Templar", 8, "pvp");
  assert.equal(guide.sampleSize, boots.sampleSize);
  assert.notEqual(guide.sampleSize, pvpSnapshot.classes.templar.sampleSize);
  assert.equal(guide.options[0].share, expected);
});

test("all nine PvP classes have independent, valid references for the supported slots", () => {
  for (const className of ["Gladiator", "Templar", "Assassin", "Ranger", "Sorcerer", "Spiritmaster", "Cleric", "Chanter", "Fighter"]) {
    for (const slot of [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 13, 15, 19]) {
      const guide = getGearReference(className, slot, "pvp");
      assert.equal(guide.status, "available");
      assert.ok(guide.sampleSize > 0);
      guide.options.forEach((option, index) => {
        assert.ok(option.id && option.name && option.share >= 0 && option.share <= 100);
        assert.equal(/[\uac00-\ud7af]/u.test(option.name), false, `Missing stat label for ${option.id}`);
        if (index > 0) assert.ok(guide.options[index - 1].share >= option.share);
      });
    }
  }
  assert.equal(getGearReference("Unknown", 1, "pvp").status, "unknown-class");
  assert.deepEqual(getGearReference("Templar", 41, "pvp").options, []);
  assert.deepEqual(getGearReference("Templar", 11, "pvp"), getGearReference("Templar", 12, "pvp"));
});

test("PvP highlights match the official stat ID even when labels differ", () => {
  const result = normalizeEquipmentDetails(officialItemSchema.parse({
    id: 1, name: "Boots", subStats: [{ id: "AbnormalResistance", name: "Localized resistance", value: "5%" }],
  }));
  assert.equal(isCurrentBinding("Status Effect Resist", result, "AbnormalResistance"), true);
  assert.equal(isCurrentBinding("Localized resistance", result, "DifferentID"), false);
});

test("stored gear modes accept only PvE and PvP and recover from invalid values", () => {
  assert.equal(parseGearMode("pvp"), "pvp");
  for (const value of ["pve", null, "", "invalid", "PVP", { mode: "pvp" }]) assert.equal(parseGearMode(value), "pve");
});

test("rank boundaries include every tier without promoting a rounded score", () => {
  for (const [score, expected] of [[0, "D"], [4.999, "D"], [5, "C"], [12, "B"], [22, "A"], [35, "S"], [55, "S+"], [89.999, "S+"], [90, "BiS"], [100, "BiS"]]) assert.equal(rankFromScore(score)?.label, expected);
  for (const score of [NaN, Infinity, -1, 101]) assert.equal(rankFromScore(score), null);
});

test("ranks measure weighted binding coverage and do not count base stats, skills or stones", () => {
  const guide = getGearReference("Templar", 1, "pve");
  const details = normalizeEquipmentDetails(officialItemSchema.parse({
    id: 1, name: "Sword", mainStats: [{ id: "STR", name: "Might", value: "99" }],
    subStats: [{ id: "CombatSpeed", name: "Combat Speed", value: "10%" }, { id: "CombatSpeed", name: "Combat Speed", value: "10%" }],
    magicStoneStat: [{ id: "STR", name: "Might", value: "100" }], subSkills: [{ id: 1, name: "Might", level: 20 }],
  }));
  const rating = calculateGearRating(details, guide);
  assert.equal(rating.matched, 1);
  assert.equal(rating.score, Math.round(100 / guide.options.reduce((sum, option) => sum + option.share, 0) * 1000) / 10);
  assert.notEqual(rating.rank.label, "BiS");
});

test("full affinity reaches BiS while unsupported slots and failed data stay unranked", () => {
  const guide = getGearReference("Templar", 1, "pve");
  const details = normalizeEquipmentDetails(officialItemSchema.parse({ id: 1, name: "Sword", subStats: guide.options.map((option, index) => ({ id: String(index), name: option.name, value: "1" })) }));
  assert.equal(calculateGearRating(details, guide).rank.label, "BiS");
  assert.equal(calculateGearRating(details, guide).score, 100);
  assert.equal(calculateGearRating(null, guide), null);
  assert.equal(calculateGearRating(details, getGearReference("Templar", 41)), null);
  assert.equal(calculateGearRating(details, getGearReference("Unknown", 1)), null);
  details.subStats[0].value = "not-a-number";
  assert.equal(calculateGearRating(details, guide), null);
});

test("a gear rank changes with its PvE/PvP reference and excludes zero rolls", () => {
  const details = normalizeEquipmentDetails(officialItemSchema.parse({ id: 1, name: "Boots", subStats: [
    { id: "AbnormalResistance", name: "Status Effect Resist", value: "5%" }, { id: "MoveSpeed", name: "Move Speed", value: "0%" },
  ] }));
  const pve = calculateGearRating(details, getGearReference("Templar", 8, "pve"));
  const pvp = calculateGearRating(details, getGearReference("Templar", 8, "pvp"));
  assert.equal(pve.matched, 0);
  assert.equal(pve.rank.label, "D");
  assert.equal(pvp.matched, 1);
  assert.ok(pvp.score > pve.score);
});

test("view preferences recover safely and a card override does not change other slots", () => {
  assert.equal(parseEquipmentView("comparison"), "comparison");
  assert.equal(parseEquipmentView("flip"), "flip");
  for (const value of [null, "invalid", {}, "grid"]) assert.equal(parseEquipmentView(value), "grid");
  assert.equal(resolveCardMode("pve", { 11: "pvp" }, 11), "pvp");
  assert.equal(resolveCardMode("pve", { 11: "pvp" }, 12), "pve");
  assert.equal(resolveCardMode("pvp", {}, 12), "pvp");
});

test("equipment requests are serialized, cached and skip cancelled queued requests", async () => {
  const originalFetch = globalThis.fetch;
  const requested = [];
  let release;
  const gate = new Promise((resolve) => { release = resolve; });
  globalThis.fetch = async (url) => {
    requested.push(url);
    if (url.endsWith("queue-a")) await gate;
    return Response.json({ id: 1, name: "Test", subStats: [], fetchedAt: new Date().toISOString() });
  };
  try {
    const controller = new AbortController();
    const first = requestEquipmentDetails("queue-a", new AbortController().signal);
    const cancelled = requestEquipmentDetails("queue-cancelled", controller.signal);
    const rejected = assert.rejects(cancelled, { name: "AbortError" });
    controller.abort();
    const second = requestEquipmentDetails("queue-b", new AbortController().signal);
    assert.equal(requested.length, 1);
    release();
    await Promise.all([first, second, rejected]);
    assert.deepEqual(requested, ["/api/characters/equipment?queue-a", "/api/characters/equipment?queue-b"]);
    await requestEquipmentDetails("queue-a", new AbortController().signal);
    assert.equal(requested.length, 2);
  } finally { globalThis.fetch = originalFetch; }
});
