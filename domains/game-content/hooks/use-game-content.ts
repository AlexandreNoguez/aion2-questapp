"use client";

import { GAME_CONTENT, getGameContent } from "../data/content-catalog";
import type { GameContentViewModel } from "../types";
import { useEventSchedule } from "./use-event-schedule";

export function useGameContent(contentId: string): GameContentViewModel | null {
  const content = getGameContent(contentId);
  const schedules = useEventSchedule(content?.schedule ?? []);
  return content ? { ...content, schedules } : null;
}

export function useContentOverview(): GameContentViewModel[] {
  const rules = GAME_CONTENT.flatMap((content) => content.schedule);
  const schedules = useEventSchedule(rules);
  const schedulesById = new Map(schedules.map((schedule) => [schedule.id, schedule]));

  return GAME_CONTENT.map((content) => ({
    ...content,
    schedules: content.schedule.map((rule) => schedulesById.get(rule.id)).filter((schedule): schedule is NonNullable<typeof schedule> => Boolean(schedule)),
  }));
}

