import type { AgendaEvent, AgendaEventViewModel, AgendaFilters } from "../types";
import { formatOccurrence, getNextOccurrence } from "./schedule-calculator";

export function formatAgendaCountdown(date: Date, now: Date): string {
  const totalSeconds = Math.max(0, Math.ceil((date.getTime() - now.getTime()) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor(totalSeconds % 86400 / 3600);
  const minutes = Math.floor(totalSeconds % 3600 / 60);
  const seconds = totalSeconds % 60;
  const clock = [hours, minutes, seconds].map((value) => String(value).padStart(2, "0")).join(":");
  return days ? `${days}d ${clock}` : clock;
}

export function buildAgendaEvents(events: AgendaEvent[], now: Date | null): AgendaEventViewModel[] {
  return events.map(({ rule, ...event }) => {
    const hasSchedule = rule.kind !== "respawn";
    const next = now ? getNextOccurrence(rule, now) : null;
    return {
      ...event,
      nextOccurrenceAt: next?.getTime() ?? null,
      hasSchedule,
      countdownLabel: next && now ? formatAgendaCountdown(next, now) : "--:--:--",
      nextLabel: !hasSchedule ? "Depende da última morte" : next && now ? formatOccurrence(next, now) : "Calculando próxima ocorrência…",
    };
  });
}

export const DEFAULT_AGENDA_FILTERS: AgendaFilters = {
  search: "", category: "all", schedule: "all", sort: "default",
};

function normalizeSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR").trim();
}

export function filterAgendaEvents(events: AgendaEventViewModel[], filters: AgendaFilters): AgendaEventViewModel[] {
  const search = normalizeSearch(filters.search);
  const filtered = events.filter((event) =>
    normalizeSearch(event.title).includes(search)
    && (filters.category === "all" || event.category === filters.category)
    && (filters.schedule === "all" || event.hasSchedule === (filters.schedule === "scheduled")),
  );
  if (filters.sort === "name") filtered.sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));
  if (filters.sort === "next") filtered.sort((a, b) =>
    (a.nextOccurrenceAt ?? Infinity) - (b.nextOccurrenceAt ?? Infinity),
  );
  return filtered;
}
