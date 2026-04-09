import { parseISO, format, isAfter, isBefore, addMinutes } from 'date-fns';

/** Combine fest day + HH:mm into a JS Date in the device's local timezone. */
export function performanceToDate(dateStr: string, timeStr: string): Date {
  return parseISO(`${dateStr}T${timeStr}:00`);
}

export function formatPerformanceRange(
  dateStr: string,
  start: string,
  end: string
): string {
  const d = parseISO(dateStr);
  return `${format(d, 'EEE MMM d')} · ${start}–${end}`;
}

export function isPerformanceHappeningNow(
  dateStr: string,
  start: string,
  end: string,
  now: Date = new Date()
): boolean {
  const s = performanceToDate(dateStr, start);
  const e = performanceToDate(dateStr, end);
  return !isBefore(now, s) && isBefore(now, e);
}

export function isStartingWithinMinutes(
  dateStr: string,
  start: string,
  withinMinutes: number,
  now: Date = new Date()
): boolean {
  const s = performanceToDate(dateStr, start);
  const windowStart = addMinutes(s, -withinMinutes);
  return (isAfter(now, windowStart) || now.getTime() === windowStart.getTime()) && isBefore(now, s);
}
