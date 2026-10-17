export type ChecklistPeriod = "daily" | "weekly" | "events";
export type ChecklistFilter = "all" | "pending" | "done";
export type PlayerClassId =
  | "gladiator"
  | "templar"
  | "assassin"
  | "ranger"
  | "sorcerer"
  | "spiritmaster"
  | "cleric"
  | "chanter";

export type PlayerClass = {
  id: PlayerClassId;
  label: string;
  role: string;
};

export type Quest = { id: string; title: string; scope?: string; note?: string };
export type QuestGroup = { id: string; title?: string; eyebrow?: string; quests: Quest[] };
export type PeriodSummary = { total: number; completed: number; pending: number; percentage: number };

export type ChecklistViewModel = {
  activePeriod: ChecklistPeriod;
  filter: ChecklistFilter;
  groups: QuestGroup[];
  summary: PeriodSummary;
  completedIds: ReadonlySet<string>;
  playerClass: PlayerClassId;
  isHydrated: boolean;
  resetDialogOpen: boolean;
};

export type ChecklistActions = {
  setFilter: (filter: ChecklistFilter) => void;
  toggleQuest: (id: string) => void;
  setPlayerClass: (playerClass: PlayerClassId) => void;
  requestReset: () => void;
  cancelReset: () => void;
  confirmReset: () => void;
};
