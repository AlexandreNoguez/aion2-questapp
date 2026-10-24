"use client";

import { useEffect, useMemo, useState } from "react";
import { AGENDA_EVENTS } from "../data/event-agenda";
import { buildAgendaEvents, DEFAULT_AGENDA_FILTERS, filterAgendaEvents, parseAgendaFilters } from "../services/event-agenda";
import type { AgendaFilters } from "../types";

const STORAGE_KEY = "aion2-agenda-filters:v1";

export function useEventAgenda() {
  // A primeira renderização é estável entre servidor e navegador.
  const [now, setNow] = useState<Date | null>(null);
  const [filters, setFilters] = useState<AgendaFilters>(DEFAULT_AGENDA_FILTERS);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      try {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) setFilters(parseAgendaFilters(JSON.parse(stored)));
      } catch {
        // A agenda continua utilizável com armazenamento indisponível ou inválido.
      }
      setPreferencesLoaded(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (!preferencesLoaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
    } catch {
      // As preferências continuam funcionando em memória.
    }
  }, [filters, preferencesLoaded]);

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
    hasActiveFilters: filters.search !== DEFAULT_AGENDA_FILTERS.search || filters.category !== DEFAULT_AGENDA_FILTERS.category || filters.schedule !== DEFAULT_AGENDA_FILTERS.schedule || filters.sort !== DEFAULT_AGENDA_FILTERS.sort,
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
