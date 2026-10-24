"use client";

import { useEffect, useMemo, useState } from "react";
import { AGENDA_EVENTS } from "../data/event-agenda";
import { buildAgendaEvents, DEFAULT_AGENDA_FILTERS, filterAgendaEvents } from "../services/event-agenda";
import type { AgendaFilters } from "../types";

export function useEventAgenda() {
  // A primeira renderização é estável entre servidor e navegador.
  const [now, setNow] = useState<Date | null>(null);
  const [filters, setFilters] = useState<AgendaFilters>(DEFAULT_AGENDA_FILTERS);

  useEffect(() => {
    const update = () => setNow(new Date());
    const initial = window.setTimeout(update, 0);
    const timer = window.setInterval(update, 1000);
    window.addEventListener("focus", update);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);

  const allEvents = useMemo(() => buildAgendaEvents(AGENDA_EVENTS, now), [now]);
  const events = useMemo(() => filterAgendaEvents(allEvents, filters), [allEvents, filters]);
  const categories = useMemo(() => [...new Set(AGENDA_EVENTS.map((event) => event.category))], []);

  return {
    events, filters, categories, total: allEvents.length,
    hasActiveFilters: filters.search !== "" || filters.category !== "all" || filters.schedule !== "all" || filters.sort !== "default",
    actions: {
      setSearch: (search: string) => setFilters((current) => ({ ...current, search })),
      setCategory: (category: AgendaFilters["category"]) => setFilters((current) => ({ ...current, category })),
      setSchedule: (schedule: AgendaFilters["schedule"]) => setFilters((current) => ({ ...current, schedule })),
      setSort: (sort: AgendaFilters["sort"]) => setFilters((current) => ({ ...current, sort })),
      reset: () => setFilters(DEFAULT_AGENDA_FILTERS),
    },
  };
}

export type EventAgendaModel = ReturnType<typeof useEventAgenda>;
