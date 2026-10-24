"use client";

import { useEventAgenda } from "../hooks/use-event-agenda";
import { EventAgenda } from "./event-agenda";

export function EventAgendaPage() {
  const events = useEventAgenda();
  return <EventAgenda events={events} />;
}
