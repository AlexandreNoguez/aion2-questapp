import type { AgendaEvent, AgendaEventViewModel } from "../types";
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
      hasSchedule,
      countdownLabel: next && now ? formatAgendaCountdown(next, now) : "--:--:--",
      nextLabel: !hasSchedule ? "Depende da última morte" : next && now ? formatOccurrence(next, now) : "Calculando próxima ocorrência…",
    };
  });
}
