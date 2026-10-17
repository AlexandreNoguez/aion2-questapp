"use client";

import { useContentOverview } from "../hooks/use-game-content";
import { ContentOverview } from "./content-overview";

export function ContentOverviewPage() {
  const contents = useContentOverview();
  return <ContentOverview contents={contents} />;
}

