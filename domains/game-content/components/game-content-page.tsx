"use client";

import { notFound } from "next/navigation";
import { useGameContent } from "../hooks/use-game-content";
import { ContentDetails } from "./content-details";

type Props = { contentId: string };

export function GameContentPage({ contentId }: Props) {
  const content = useGameContent(contentId);
  if (!content) notFound();
  return <ContentDetails content={content} />;
}

