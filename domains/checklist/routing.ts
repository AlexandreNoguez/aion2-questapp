import type { ChecklistPeriod } from "./types";

export const CHECKLIST_PERIOD_BY_SLUG = {
  diarias: "daily",
  semanais: "weekly",
  eventos: "events",
} as const satisfies Record<string, ChecklistPeriod>;

export function parseChecklistPeriod(slug: string): ChecklistPeriod | null {
  return CHECKLIST_PERIOD_BY_SLUG[slug as keyof typeof CHECKLIST_PERIOD_BY_SLUG] ?? null;
}

