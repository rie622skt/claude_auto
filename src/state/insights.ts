import { Session } from './store';

const DAY = 86400000;

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function dayKey(d: Date): string {
  return startOfDay(d).toISOString().slice(0, 10);
}

export function focusOnly(sessions: Session[]): Session[] {
  return sessions.filter((s) => s.kind === 'focus');
}

function secondsForDay(sessions: Session[], d: Date): number {
  const key = dayKey(d);
  return focusOnly(sessions)
    .filter((s) => dayKey(new Date(s.startedAt)) === key)
    .reduce((sum, s) => sum + s.actualSec, 0);
}

export function todaySeconds(sessions: Session[], now = new Date()): number {
  return secondsForDay(sessions, now);
}

export function weekSeconds(sessions: Session[], now = new Date()): number {
  let total = 0;
  for (let i = 0; i < 7; i++) {
    total += secondsForDay(sessions, new Date(now.getTime() - i * DAY));
  }
  return total;
}

export function totalFocusSeconds(sessions: Session[]): number {
  return focusOnly(sessions).reduce((s, x) => s + x.actualSec, 0);
}

/** Consecutive days (ending today, with a one-day grace) that have a completed focus session. */
export function streakDays(sessions: Session[], now = new Date()): number {
  const completed = new Set(
    focusOnly(sessions)
      .filter((s) => s.completed)
      .map((s) => dayKey(new Date(s.startedAt))),
  );
  if (completed.size === 0) return 0;

  let cursor = startOfDay(now);
  if (!completed.has(dayKey(cursor))) {
    // Grace: a streak still "alive" earlier today counts from yesterday.
    cursor = new Date(cursor.getTime() - DAY);
  }
  let streak = 0;
  while (completed.has(dayKey(cursor))) {
    streak++;
    cursor = new Date(cursor.getTime() - DAY);
  }
  return streak;
}

const WEEKDAY_LETTERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export type DayBar = { key: string; label: string; minutes: number; isToday: boolean };

/** Last 7 calendar days, oldest -> newest, with focused minutes per day. */
export function last7Days(sessions: Session[], now = new Date()): DayBar[] {
  const todayKey = dayKey(now);
  const out: DayBar[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * DAY);
    out.push({
      key: dayKey(d),
      label: WEEKDAY_LETTERS[d.getDay()],
      minutes: Math.round(secondsForDay(sessions, d) / 60),
      isToday: dayKey(d) === todayKey,
    });
  }
  return out;
}

export type PartOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Night';

function bucketForHour(h: number): PartOfDay {
  if (h >= 5 && h < 12) return 'Morning';
  if (h >= 12 && h < 17) return 'Afternoon';
  if (h >= 17 && h < 22) return 'Evening';
  return 'Night';
}

/** The part of day with the most focused time, or null if there's no history yet. */
export function bestPartOfDay(sessions: Session[]): PartOfDay | null {
  const totals: Record<PartOfDay, number> = { Morning: 0, Afternoon: 0, Evening: 0, Night: 0 };
  let any = false;
  for (const s of focusOnly(sessions)) {
    totals[bucketForHour(new Date(s.startedAt).getHours())] += s.actualSec;
    any = true;
  }
  if (!any) return null;
  return (Object.keys(totals) as PartOfDay[]).reduce((best, k) =>
    totals[k] > totals[best] ? k : best,
  );
}

/* ----------------------------- formatting ----------------------------- */

/** "2h 15m" / "45m" / "0m" — for accumulated durations. */
export function formatDuration(seconds: number): string {
  const mins = Math.round(seconds / 60);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/** "mm:ss" — for the live countdown. */
export function formatClock(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
