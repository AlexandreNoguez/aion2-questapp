import { GAME_CONTENT } from "./content-catalog";
import type { AgendaEvent } from "../types";

// TODO: Preencher imagePath abaixo com os caminhos das imagens em public/.
// Exemplo: public/fenda.webp => imagePath: "/fenda.webp".
// Todas as imagens da agenda são configuradas aqui e exibidas por
// domains/game-content/components/event-agenda-card.tsx.
const EVENT_PRESENTATION: { scheduleId: string; imagePath: string | null }[] = [
  { scheduleId: "rift", imagePath: null },
  { scheduleId: "watcher-kaira", imagePath: null },
  { scheduleId: "siege-bosses", imagePath: null },
  { scheduleId: "nahma", imagePath: null },
  { scheduleId: "field-bosses", imagePath: null },
  { scheduleId: "shugo", imagePath: null },
  { scheduleId: "invasion", imagePath: null },
  { scheduleId: "artifact-siege", imagePath: null },
  { scheduleId: "arena-day", imagePath: null },
  { scheduleId: "arena-night", imagePath: null },
];

// Títulos e horários vêm do catálogo existente, sem duplicar as regras.
export const AGENDA_EVENTS: AgendaEvent[] = EVENT_PRESENTATION.map(({ scheduleId, imagePath }) => {
  const content = GAME_CONTENT.find((entry) => entry.schedule.some((rule) => rule.id === scheduleId));
  const rule = content?.schedule.find((entry) => entry.id === scheduleId);
  if (!content || !rule) throw new Error(`Evento da agenda não encontrado: ${scheduleId}`);
  return { id: rule.id, title: rule.title, href: `/conteudos/${content.id}`, imagePath, rule };
});
