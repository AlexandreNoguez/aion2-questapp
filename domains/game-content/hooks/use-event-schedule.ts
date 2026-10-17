"use client";

import { useEffect, useMemo, useState } from "react";
import type { ScheduleRule, ScheduleViewModel } from "../types";
import { formatCountdown, formatDuration, formatOccurrence, formatScheduleRule, getNextOccurrence } from "../services/schedule-calculator";

export function useEventSchedule(rules: ScheduleRule[]): ScheduleViewModel[] {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return useMemo(() => rules.map((rule) => {
    const next = getNextOccurrence(rule, now);
    return {
      id: rule.id,
      title: rule.title,
      scheduleLabel: formatScheduleRule(rule),
      nextLabel: next ? formatOccurrence(next, now) : null,
      countdownLabel: next ? formatCountdown(next, now) : null,
      durationLabel: formatDuration(rule.durationMinutes),
      note: rule.note,
    };
  }), [now, rules]);
}

