import type { ScheduleRule } from "../types";

const SERVER_OFFSET_MINUTES = -180;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

function parseTime(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
}

function serverParts(now: Date) {
  const shifted = new Date(now.getTime() + SERVER_OFFSET_MINUTES * MINUTE_MS);
  return {
    year: shifted.getUTCFullYear(),
    month: shifted.getUTCMonth(),
    day: shifted.getUTCDate(),
    weekday: shifted.getUTCDay(),
    hour: shifted.getUTCHours(),
    minute: shifted.getUTCMinutes(),
  };
}

function fromServerTime(year: number, month: number, day: number, hour: number, minute: number) {
  return new Date(Date.UTC(year, month, day, hour, minute) - SERVER_OFFSET_MINUTES * MINUTE_MS);
}

function nextDailyTime(times: string[], now: Date) {
  const parts = serverParts(now);
  const candidates = times.map((time) => {
    const { hour, minute } = parseTime(time);
    return fromServerTime(parts.year, parts.month, parts.day, hour, minute);
  });
  const today = candidates.find((candidate) => candidate.getTime() > now.getTime());
  return today ?? new Date(candidates[0].getTime() + DAY_MS);
}

function nextWeeklyTime(weekdays: number[], time: string, now: Date) {
  const parts = serverParts(now);
  const { hour, minute } = parseTime(time);
  const candidates = weekdays.flatMap((weekday) => {
    let daysAhead = (weekday - parts.weekday + 7) % 7;
    let candidate = fromServerTime(parts.year, parts.month, parts.day + daysAhead, hour, minute);
    if (candidate.getTime() <= now.getTime()) {
      daysAhead += 7;
      candidate = fromServerTime(parts.year, parts.month, parts.day + daysAhead, hour, minute);
    }
    return candidate;
  });
  return candidates.sort((a, b) => a.getTime() - b.getTime())[0];
}

function nextHourlyTime(minute: number, now: Date) {
  const parts = serverParts(now);
  let candidate = fromServerTime(parts.year, parts.month, parts.day, parts.hour, minute);
  if (candidate.getTime() <= now.getTime()) candidate = new Date(candidate.getTime() + 60 * MINUTE_MS);
  return candidate;
}

export function getNextOccurrence(rule: ScheduleRule, now: Date): Date | null {
  switch (rule.kind) {
    case "daily-times": return nextDailyTime(rule.times, now);
    case "weekly": return nextWeeklyTime(rule.weekdays, rule.time, now);
    case "hourly": return nextHourlyTime(rule.minute, now);
    case "daily-window": return nextDailyTime([rule.startTime], now);
    case "respawn": return null;
  }
}

const WEEKDAY_LABELS = ["dom", "seg", "ter", "qua", "qui", "sex", "sáb"];

export function formatScheduleRule(rule: ScheduleRule) {
  switch (rule.kind) {
    case "daily-times": return `Todos os dias · ${rule.times.join(" · ")}`;
    case "weekly": return `${rule.weekdays.map((day) => WEEKDAY_LABELS[day]).join(" · ")} · ${rule.time}`;
    case "hourly": return rule.minute === 0 ? "Toda hora · minuto 00" : `Toda hora · minuto ${String(rule.minute).padStart(2, "0")}`;
    case "daily-window": return `Todos os dias · ${rule.startTime}–${rule.endTime}`;
    case "respawn": return `Após a morte · ${rule.intervalsMinutes.map(formatInterval).join(" · ")}`;
  }
}

function formatInterval(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours} h` : `${Math.floor(hours)} h ${minutes % 60} min`;
}

export function formatOccurrence(date: Date, now: Date) {
  const dateFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit" });
  const dayFormatter = new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit" });
  const sameServerDay = dayFormatter.format(date) === dayFormatter.format(now);
  return sameServerDay ? `Hoje às ${date.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit" })}` : dateFormatter.format(date).replace(".", "");
}

export function formatCountdown(date: Date, now: Date) {
  const totalMinutes = Math.max(0, Math.ceil((date.getTime() - now.getTime()) / MINUTE_MS));
  if (totalMinutes < 60) return `em ${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return minutes ? `em ${hours} h ${minutes} min` : `em ${hours} h`;
}

export function formatDuration(minutes?: number) {
  if (!minutes) return null;
  return minutes < 60 ? `${minutes} min` : `${minutes / 60} h`;
}

