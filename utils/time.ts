import { parseISO, format, isAfter, isBefore, addMinutes, parse } from 'date-fns';
import { enUS } from 'date-fns/locale';

/** Anchor date — only the parsed clock is used for 12-hour display. */
const CLOCK_ANCHOR = new Date(2026, 0, 1);

function parseHm(timeStr: string): Date {
  return parse(timeStr.trim(), 'HH:mm', CLOCK_ANCHOR);
}

/** Format stored `HH:mm` as 12-hour with AM/PM (e.g. `6:45 PM`). */
export function formatTime12(timeStr: string): string {
  return format(parseHm(timeStr), 'h:mm a', { locale: enUS });
}

/** e.g. `6:45 PM–8:30 PM` */
export function formatTimeRange12(start: string, end: string): string {
  return `${formatTime12(start)}–${formatTime12(end)}`;
}

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
  return `${format(d, 'EEE MMM d', { locale: enUS })} · ${formatTimeRange12(start, end)}`;
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
