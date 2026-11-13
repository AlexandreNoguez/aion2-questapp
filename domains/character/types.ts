export type Region = "la" | "nae" | "naw" | "eu" | "as";

export type CharacterIdentity = {
  region: Region;
  serverId: number;
  characterId: string;
};

export type CharacterServer = { id: number; name: string; faction: string };
export type CharacterSummary = CharacterIdentity & {
  name: string;
  serverName: string;
  level: number;
  faction: string;
  image: string | null;
};

export type CharacterSearch = {
  characters: CharacterSummary[];
  page: number;
  pages: number;
  total: number;
};

export type EquipmentGroup = "weapons" | "armor" | "accessories" | "arcana";
export type GearMode = "pve" | "pvp";
export type EquipmentView = "grid" | "comparison" | "flip";
export type EquipmentItem = {
  id: number;
  slot: number;
  slotName: string;
  group: EquipmentGroup;
  name: string;
  grade: string;
  icon: string | null;
  enchantLevel: number;
  exceedLevel: number;
};

export type EquipmentStat = {
  id: string;
  name: string;
  value: string;
  minValue: string | null;
  extra: string | null;
  exceed: boolean;
};

export type EquipmentDetails = {
  id: number;
  name: string;
  category: string | null;
  itemLevel: number | null;
  soulBindRate: string | null;
  mainStats: EquipmentStat[];
  subStats: EquipmentStat[];
  skills: { id: string; name: string; level: string }[];
  stones: EquipmentStat[];
  fetchedAt: string;
};

export type CharacterProfile = CharacterSummary & {
  className: string;
  title: string | null;
  combatPower: number | null;
  itemLevel: number | null;
  equipment: EquipmentItem[];
  stats: { name: string; type: string; value: number; bonuses: string[] }[];
  fetchedAt: string;
};

export type CharacterFavorite = CharacterIdentity & { name: string; serverName: string };
