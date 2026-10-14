import type { PlayerClass } from "../types";

export const PLAYER_CLASSES: PlayerClass[] = [
  { id: "gladiator", label: "Gladiador", role: "Dano corpo a corpo" },
  { id: "templar", label: "Templário", role: "Defesa e proteção" },
  { id: "assassin", label: "Assassino", role: "Precisão corpo a corpo" },
  { id: "ranger", label: "Ranger", role: "Dano à distância" },
  { id: "sorcerer", label: "Feiticeiro", role: "Dano mágico explosivo" },
  { id: "spiritmaster", label: "Espiritualista", role: "Invocação e controle" },
  { id: "cleric", label: "Clérigo", role: "Cura e suporte" },
  { id: "chanter", label: "Encantador", role: "Suporte versátil" },
];

export const DEFAULT_PLAYER_CLASS = "assassin" as const;
