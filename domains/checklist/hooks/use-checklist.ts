"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QUEST_GROUPS } from "../data/quests";
import { DEFAULT_PLAYER_CLASS, PLAYER_CLASSES } from "../data/classes";
import type { ChecklistActions, ChecklistFilter, ChecklistPeriod, ChecklistViewModel, PlayerClassId } from "../types";

const STORAGE_KEY = "aion2-checklist:v1";
type StoredChecklist = { completed: string[]; playerClass?: PlayerClassId; updatedAt: string };
type InitialChecklist = { completedIds: Set<string>; playerClass: PlayerClassId };

function readStoredChecklist(): InitialChecklist {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { completedIds: new Set(), playerClass: DEFAULT_PLAYER_CLASS };
    const parsed = JSON.parse(raw) as Partial<StoredChecklist>;
    const validClass = PLAYER_CLASSES.some((item) => item.id === parsed.playerClass);
    return {
      completedIds: new Set(Array.isArray(parsed.completed) ? parsed.completed : []),
      playerClass: validClass ? parsed.playerClass! : DEFAULT_PLAYER_CLASS,
    };
  } catch {
    return { completedIds: new Set(), playerClass: DEFAULT_PLAYER_CLASS };
  }
}

function persistChecklist(completedIds: ReadonlySet<string>, playerClass: PlayerClassId) {
  const payload: StoredChecklist = { completed: [...completedIds], playerClass, updatedAt: new Date().toISOString() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // The checklist remains usable when storage is unavailable (private mode/quota).
  }
}

export function useChecklist(activePeriod: ChecklistPeriod): { viewModel: ChecklistViewModel; actions: ChecklistActions } {
  const [filter, setFilter] = useState<ChecklistFilter>("all");
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [playerClass, setPlayerClass] = useState<PlayerClassId>(DEFAULT_PLAYER_CLASS);
  const [isHydrated, setIsHydrated] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  useEffect(() => {
    const hydration = window.setTimeout(() => {
      const stored = readStoredChecklist();
      setCompletedIds(stored.completedIds);
      setPlayerClass(stored.playerClass);
      setIsHydrated(true);
    }, 0);
    return () => window.clearTimeout(hydration);
  }, []);

  useEffect(() => {
    if (isHydrated) persistChecklist(completedIds, playerClass);
  }, [completedIds, isHydrated, playerClass]);

  const allGroups = QUEST_GROUPS[activePeriod];
  const allQuests = useMemo(() => allGroups.flatMap((group) => group.quests), [allGroups]);
  const summary = useMemo(() => {
    const completed = allQuests.filter((quest) => completedIds.has(quest.id)).length;
    const total = allQuests.length;
    return { total, completed, pending: total - completed, percentage: total === 0 ? 0 : Math.round((completed / total) * 100) };
  }, [allQuests, completedIds]);
  const groups = useMemo(() => allGroups.map((group) => ({
    ...group,
    quests: group.quests.filter((quest) => {
      const done = completedIds.has(quest.id);
      return filter === "all" || (filter === "done" ? done : !done);
    }),
  })).filter((group) => group.quests.length > 0), [allGroups, completedIds, filter]);

  const toggleQuest = useCallback((id: string) => {
    setCompletedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const confirmReset = useCallback(() => {
    const periodIds = new Set(QUEST_GROUPS[activePeriod].flatMap((group) => group.quests.map((quest) => quest.id)));
    setCompletedIds((current) => new Set([...current].filter((id) => !periodIds.has(id))));
    setResetDialogOpen(false);
  }, [activePeriod]);

  const actions = useMemo<ChecklistActions>(() => ({
    setFilter,
    toggleQuest,
    setPlayerClass,
    requestReset: () => setResetDialogOpen(true),
    cancelReset: () => setResetDialogOpen(false),
    confirmReset,
  }), [confirmReset, toggleQuest]);

  return { viewModel: { activePeriod, filter, groups, summary, completedIds, playerClass, isHydrated, resetDialogOpen }, actions };
}
