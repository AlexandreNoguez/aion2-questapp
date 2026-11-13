import type { EquipmentView, GearMode } from "../types";

export function parseEquipmentView(value: unknown): EquipmentView {
  return value === "comparison" || value === "flip" ? value : "grid";
}

export function resolveCardMode(defaultMode: GearMode, overrides: Record<number, GearMode>, slot: number): GearMode {
  return overrides[slot] === "pve" || overrides[slot] === "pvp" ? overrides[slot] : defaultMode;
}
