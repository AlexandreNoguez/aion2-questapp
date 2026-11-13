import type { EquipmentDetails } from "../types";
import type { getGearReference } from "./gear-reference";

export const GEAR_RANKS = [
  { label: "D", minimum: 0, color: "#e38a86" },
  { label: "C", minimum: 5, color: "#b1bac8" },
  { label: "B", minimum: 12, color: "#79b6ff" },
  { label: "A", minimum: 22, color: "#4bd6d0" },
  { label: "S", minimum: 35, color: "#f5c45e" },
  { label: "S+", minimum: 55, color: "#d094ff" },
  { label: "BiS", minimum: 90, color: "#8ce9ac" },
] as const;

export function rankFromScore(score: number) {
  if (!Number.isFinite(score) || score < 0 || score > 100) return null;
  return [...GEAR_RANKS].reverse().find((rank) => score >= rank.minimum) ?? null;
}

type Guide = ReturnType<typeof getGearReference>;
type Rank = (typeof GEAR_RANKS)[number];
export type GearRating = { rank: Rank; score: number; matched: number; total: number };

function numericValue(value: string): number | null {
  const cleaned = value.trim().replace(/%$/, "").replace(",", ".");
  if (!/^[+-]?\d+(?:\.\d+)?$/.test(cleaned)) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

/** Weighted coverage of the reference's stat names, not a power or roll-value score. */
export function calculateGearRating(details: EquipmentDetails | null, guide: Guide): GearRating | null {
  if (!details || guide.status !== "available") return null;
  const options = guide.options.filter((option) => Number.isFinite(option.share) && option.share > 0);
  const weight = options.reduce((sum, option) => sum + option.share, 0);
  if (!weight || details.subStats.some((stat) => numericValue(stat.value) === null)) return null;
  let earned = 0;
  let matched = 0;
  for (const option of options) {
    const found = details.subStats.some((stat) =>
      (option.id ? stat.id === option.id : stat.name.trim().toLowerCase() === option.name.trim().toLowerCase()) &&
      numericValue(stat.value)! > 0,
    );
    if (found) { earned += option.share; matched++; }
  }
  const rawScore = Math.min(100, Math.max(0, earned / weight * 100));
  const rank = rankFromScore(rawScore)!;
  return { rank, score: Math.round(rawScore * 10) / 10, matched, total: options.length };
}
