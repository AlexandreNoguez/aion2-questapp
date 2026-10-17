import {
  BookOpenText,
  CalendarCheck2,
  CalendarClock,
  Castle,
  CircleGauge,
  ListChecks,
  PartyPopper,
  Repeat2,
  Swords,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
};

export type NavigationSection = {
  id: "checklist" | "content";
  label: string;
  icon: LucideIcon;
  defaultHref: string;
  items: NavigationItem[];
};

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    id: "checklist",
    label: "Checklist",
    icon: ListChecks,
    defaultHref: "/checklist/diarias",
    items: [
      { label: "Diárias", href: "/checklist/diarias", icon: CalendarCheck2, exact: true },
      { label: "Semanais", href: "/checklist/semanais", icon: CalendarClock, exact: true },
      { label: "Eventos", href: "/checklist/eventos", icon: PartyPopper, exact: true },
    ],
  },
  {
    id: "content",
    label: "Conteúdos",
    icon: BookOpenText,
    defaultHref: "/conteudos",
    items: [
      { label: "Visão geral", href: "/conteudos", icon: CircleGauge, exact: true },
      { label: "Fenda Espaço-Temporal", href: "/conteudos/fenda-espaco-temporal", icon: Repeat2 },
      { label: "Chefes", href: "/conteudos/chefes", icon: Swords },
      { label: "Shugo Festa", href: "/conteudos/shugo-festa", icon: PartyPopper },
      { label: "Invasão Dimensional", href: "/conteudos/invasao-dimensional", icon: CalendarClock },
      { label: "Abismo e Cerco", href: "/conteudos/abismo-e-cerco", icon: Castle },
    ],
  },
];

