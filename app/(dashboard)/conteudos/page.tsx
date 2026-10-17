import type { Metadata } from "next";
import { ContentOverviewPage } from "@/domains/game-content/components/content-overview-page";

export const metadata: Metadata = {
  title: "Conteúdos e horários — AION 2 Companion",
  description: "Horários, requisitos e informações dos principais conteúdos recorrentes do AION 2 Global.",
};

export default function ContentsPage() {
  return <ContentOverviewPage />;
}

