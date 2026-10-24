import type { Metadata } from "next";
import { EventAgendaPage } from "@/domains/game-content/components/event-agenda-page";

export const metadata: Metadata = {
  title: "Agenda de eventos — AION 2 Companion",
  description: "Contagem regressiva para os próximos eventos do AION 2 Global na América do Sul.",
};

export default function AgendaPage() {
  return <EventAgendaPage />;
}
