import snapshot from "../data/pve-reference.json" with { type: "json" };
import pvpSnapshot from "../data/pvp-reference.json" with { type: "json" };
import type { EquipmentDetails, GearMode } from "../types";

type ClassReference = { sampleSize: number; slots: Record<string, (string | number)[][]> };
const classes: Record<string, ClassReference> = snapshot.classes;
type PvpClassReference = { sampleSize: number; sourceJob: string; slots: Record<string, { sampleSize: number; options: (string | number)[][] }> };
const pvpClasses: Record<string, PvpClassReference> = pvpSnapshot.classes;
const PVP_STAT_NAMES: Record<string, string> = {
  MoveSpeed: "Move Speed", AbnormalResistance: "Status Effect Resist", WIS: "Willpower", Perfect: "Perfect Chance",
  WeaponAccuracy: "Accuracy", CON: "Constitution", Time: "Time [Siel]", Destruction: "Destruction [Zikel]",
  Illusion: "Illusion [Kaisinel]", Wisdom: "Wisdom [Lumiel]", Freedom: "Freedom [Vaizel]", Justice: "Justice [Nezekan]",
  STR: "Might", AGI: "Precision", INT: "Intelligence", DEX: "Dexterity", Destiny: "Destiny [Marchutan]",
  DecreaseCriticalDamage: "Critical Damage Tolerance", DecreaseWeaponDamage: "Weapon Damage Tolerance",
  DamageRatio: "Attack increase", HardHit: "Double Chance", WeaponFixingDamage: "Attack", Critical: "Critical Hit",
  Block: "Block", HPMax: "HP", CombatSpeed: "Combat Speed", IgnoreIronWall: "Endurance Penetration",
  AmplifyHpHealGet: "Incoming Heal", AmplifyWeaponDamage: "Weapon Damage Boost", AbnormalAccuracy: "Status Effect Accuracy",
  AmplifyAllDamage: "Damage Boost", ArmorEvasion: "Evasion", DecreaseDamage: "Damage Tolerance",
  HardHitResist: "Double Resist", ArmorDefense: "Defense", AmplifyCriticalDamage: "Critical Damage Boost",
  DefenseRatio: "Defense increase", IronWall: "Endurance", Death: "Death [Triniel]", CriticalResist: "Critical Hit Resist",
  AdditionalHitRate: "Multi-hit Chance", Restoration: "Regeneration", Space: "Space [Israphel]",
};
const LABELS: Record<string, string> = {
  gladiator: "Gladiador", templar: "Templário", assassin: "Assassino", ranger: "Ranger",
  sorcerer: "Feiticeiro", spiritmaster: "Espiritualista", cleric: "Clérigo", chanter: "Encantador", fighter: "Fighter",
};
const SLOTS: Record<number, string> = {
  1: "Weapon", 2: "Guard", 3: "Helmet", 4: "Shoulders", 5: "Torso", 6: "Pants", 7: "Gloves", 8: "Boots",
  10: "Necklace", 11: "Earrings", 12: "Earrings", 13: "Rings", 14: "Rings", 15: "Bracelet", 16: "Bracelet", 19: "Cape",
};

export const GEAR_REFERENCE_SOURCE = {
  url: snapshot.sourceUrl, sampleDate: snapshot.sampleDate, checkedDate: snapshot.checkedDate,
};

export function parseGearMode(value: unknown): GearMode {
  return value === "pvp" ? "pvp" : "pve";
}

export function getGearReference(className: string, slot: number, mode: GearMode = "pve") {
  const key = className.toLowerCase().replace(/[\s_-]/g, "");
  const label = Object.hasOwn(LABELS, key) ? LABELS[key] : className;
  if (mode === "pvp") {
    const source = Object.hasOwn(pvpClasses, key) ? pvpClasses[key] : undefined;
    const row = source?.slots[SLOTS[slot]];
    return {
      mode, classLabel: label, sampleSize: row?.sampleSize ?? null,
      status: !source ? "unknown-class" as const : !row?.options.length ? "unknown-slot" as const : "available" as const,
      source: { label: "Cielui", url: pvpSnapshot.sourceUrl, sampleDate: pvpSnapshot.sampleDate, checkedDate: pvpSnapshot.checkedDate },
      options: (row?.options ?? []).map(([id, originalName, count]) => ({
        id: String(id), name: PVP_STAT_NAMES[String(id)] ?? String(originalName),
        share: Math.round(Number(count) / row!.sampleSize * 1000) / 10,
      })),
    };
  }
  const source = Object.hasOwn(classes, key) ? classes[key] : undefined;
  const options = source?.slots[SLOTS[slot]];
  return {
    mode,
    source: { label: "Kisk", ...GEAR_REFERENCE_SOURCE },
    classLabel: label,
    sampleSize: source?.sampleSize ?? null,
    status: !source ? "unknown-class" as const : !options ? "unknown-slot" as const : "available" as const,
    options: (options ?? []).map(([name, share]) => ({ id: undefined as string | undefined, name: String(name), share: Number(share) })),
  };
}

/** Match only actual soul-binding lines, not base stats or manastones. */
export function isCurrentBinding(name: string, details: EquipmentDetails, id?: string): boolean {
  if (id) return details.subStats.some((stat) => stat.id === id);
  return details.subStats.some((stat) => stat.name.trim().toLowerCase() === name.trim().toLowerCase());
}

export function formatEquipmentStat(stat: EquipmentDetails["mainStats"][number]): string {
  const value = stat.minValue !== null ? `${stat.minValue}–${stat.value}` : stat.value;
  const extra = stat.extra && !/^[+-]?0(?:\.0+)?%?$/.test(stat.extra) ? ` (${stat.extra.startsWith("-") ? "" : "+"}${stat.extra.replace(/^\+/, "")})` : "";
  return `${value}${extra}`;
}
