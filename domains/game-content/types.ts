export type GameContentId =
  | "fenda-espaco-temporal"
  | "chefes"
  | "shugo-festa"
  | "invasao-dimensional"
  | "abismo-e-cerco";

type ScheduleBase = {
  id: string;
  title: string;
  durationMinutes?: number;
  note?: string;
};

export type ScheduleRule =
  | (ScheduleBase & { kind: "daily-times"; times: string[] })
  | (ScheduleBase & { kind: "weekly"; weekdays: number[]; time: string })
  | (ScheduleBase & { kind: "hourly"; minute: number })
  | (ScheduleBase & { kind: "daily-window"; startTime: string; endTime: string })
  | (ScheduleBase & { kind: "respawn"; intervalsMinutes: number[] });

export type ContentSource = {
  label: string;
  url: string;
};

export type GameContent = {
  id: GameContentId;
  title: string;
  eyebrow: string;
  summary: string;
  category: "Evento" | "Chefe" | "PvP" | "Sistema";
  minimumLevel?: number;
  location?: string;
  schedule: ScheduleRule[];
  description: string[];
  rewards: string[];
  tips: string[];
  warnings?: string[];
  region: "Global · América do Sul";
  lastVerifiedAt: string;
  sources: ContentSource[];
};

export type ScheduleViewModel = {
  id: string;
  title: string;
  scheduleLabel: string;
  nextLabel: string | null;
  countdownLabel: string | null;
  durationLabel: string | null;
  note?: string;
};

export type GameContentViewModel = GameContent & {
  schedules: ScheduleViewModel[];
};

export type AgendaEvent = {
  id: string;
  title: string;
  href: string;
  imagePath: string | null;
  rule: ScheduleRule;
};

export type AgendaEventViewModel = Omit<AgendaEvent, "rule"> & {
  countdownLabel: string;
  nextLabel: string;
  hasSchedule: boolean;
};

