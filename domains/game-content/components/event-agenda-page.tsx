"use client";

import { useEventAgenda } from "../hooks/use-event-agenda";
import { EventAgenda } from "./event-agenda";

export function EventAgendaPage() {
  const model = useEventAgenda();
  return <EventAgenda {...model} />;
}
