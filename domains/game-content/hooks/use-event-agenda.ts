"use client";

import { useEffect, useMemo, useState } from "react";
import { AGENDA_EVENTS } from "../data/event-agenda";
import { buildAgendaEvents } from "../services/event-agenda";

export function useEventAgenda() {
  // A primeira renderização é estável entre servidor e navegador.
  const [now, setNow] = useState<Date | null>(null);

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

  return useMemo(() => buildAgendaEvents(AGENDA_EVENTS, now), [now]);
}
