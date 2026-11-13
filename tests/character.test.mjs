import assert from "node:assert/strict";
import { test } from "node:test";
import { identitySchema, favoriteSchema, searchQuerySchema, officialEquipmentSchema, officialInfoSchema, officialSearchSchema } from "../domains/character/contracts.ts";
import { normalizeProfile, normalizeSearch, safeImage } from "../domains/character/normalizers.ts";
import { createQueryCache } from "../domains/character/services/query-cache.ts";

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
