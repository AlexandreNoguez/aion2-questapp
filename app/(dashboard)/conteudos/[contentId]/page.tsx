import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameContentPage } from "@/domains/game-content/components/game-content-page";
import { GAME_CONTENT, getGameContent } from "@/domains/game-content/data/content-catalog";

type Props = { params: Promise<{ contentId: string }> };

export function generateStaticParams() {
  return GAME_CONTENT.map(({ id: contentId }) => ({ contentId }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { contentId } = await params;
  const content = getGameContent(contentId);
  return content ? { title: `${content.title} — AION 2 Companion`, description: content.summary } : {};
}

export default async function ContentPage({ params }: Props) {
  const { contentId } = await params;
  if (!getGameContent(contentId)) notFound();
  return <GameContentPage contentId={contentId} />;
}

