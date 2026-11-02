import type { AgendaEvent } from "../types";
import { getNextOccurrence } from "./schedule-calculator";

export const EVENT_NOTIFICATION_LEAD_MS = 10 * 60_000;

export function getDueEventNotifications(events: AgendaEvent[], now: number) {
  return events.flatMap((event) => {
    const next = getNextOccurrence(event.rule, new Date(now));
    return next && next.getTime() - now <= EVENT_NOTIFICATION_LEAD_MS
      ? [{ ...event, at: next.getTime() }]
      : [];
  });
}
