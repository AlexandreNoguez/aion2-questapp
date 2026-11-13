import type { z } from "zod";
import type { officialEquipmentSchema, officialInfoSchema, officialSearchSchema, officialServersSchema } from "./contracts";
import type { CharacterIdentity, CharacterProfile, CharacterSearch, CharacterServer, EquipmentGroup, Region } from "./types";

export function factionName(race: number): string {
  return race === 1 ? "Elyos" : race === 2 ? "Asmodianos" : "Não informada";
}

export function safeImage(value?: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value, "https://profileimg.plaync.com");
    return url.protocol === "https:" && !url.username && !url.password &&
      (url.hostname === "profileimg.plaync.com" || url.hostname.endsWith(".playnccdn.com")) ? url.href : null;
  } catch {
    return null;
  }
}

export function normalizeServers(data: z.infer<typeof officialServersSchema>): CharacterServer[] {
  return data.serverList.map((entry) => ({ id: entry.serverId, name: entry.serverName, faction: factionName(entry.raceId) }));
}

export function normalizeSearch(data: z.infer<typeof officialSearchSchema>, region: Region): CharacterSearch {
  return {
    characters: (data.list ?? []).map((entry) => ({
      region, serverId: entry.serverId, characterId: entry.characterId,
      name: entry.name.replace(/<[^>]*>/g, ""), serverName: entry.serverName,
      level: entry.level, faction: factionName(entry.race), image: safeImage(entry.profileImageUrl),
    })),
    page: data.pagination.page, pages: data.pagination.endPage, total: data.pagination.total,
  };
}

const SLOT_LABELS: Record<string, string> = {
  MainHand: "Mão principal", SubHand: "Mão secundária", Helmet: "Elmo", Shoulder: "Ombros",
  Torso: "Peitoral", Pants: "Calças", Gloves: "Luvas", Boots: "Botas", Cape: "Capa", Belt: "Cinto",
  Necklace: "Colar", Earring1: "Brinco 1", Earring2: "Brinco 2", Ring1: "Anel 1", Ring2: "Anel 2",
  Bracelet1: "Bracelete 1", Bracelet2: "Bracelete 2", Rune1: "Runa 1", Rune2: "Runa 2", Amulet: "Amuleto",
  Arcana1: "Arcana 1", Arcana2: "Arcana 2", Arcana3: "Arcana 3", Arcana4: "Arcana 4", Arcana5: "Arcana 5",
};

function equipmentGroup(slotName: string): EquipmentGroup {
  if (slotName.startsWith("Arcana")) return "arcana";
  if (["MainHand", "SubHand"].includes(slotName)) return "weapons";
  if (["Helmet", "Shoulder", "Torso", "Pants", "Gloves", "Boots", "Cape"].includes(slotName)) return "armor";
  return "accessories";
}

export function normalizeProfile(
  info: z.infer<typeof officialInfoSchema>,
  gear: z.infer<typeof officialEquipmentSchema>,
  identity: CharacterIdentity,
): CharacterProfile {
  const profile = info.profile;
  const stats = info.stat.statList ?? [];
  return {
    ...identity, name: profile.characterName, serverName: profile.serverName, level: profile.characterLevel,
    faction: factionName(profile.raceId), className: profile.className, image: safeImage(profile.profileImage),
    title: profile.titleName ?? null, combatPower: profile.combatPower ?? null,
    itemLevel: stats.find((stat) => stat.type === "ItemLevel")?.value ?? null,
    equipment: (gear.equipment.equipmentList ?? []).map((item) => ({
      id: item.id, slot: item.slotPos, slotName: SLOT_LABELS[item.slotPosName] ?? item.slotPosName,
      group: equipmentGroup(item.slotPosName), name: item.name, grade: item.grade, icon: safeImage(item.icon),
      enchantLevel: item.enchantLevel, exceedLevel: item.exceedLevel ?? 0,
    })).sort((a, b) => a.slot - b.slot),
    stats: stats.filter((stat) => stat.type !== "ItemLevel").map((stat) => ({
      name: stat.name, type: stat.type, value: stat.value, bonuses: stat.statSecondList ?? [],
    })),
    fetchedAt: new Date().toISOString(),
  };
}
