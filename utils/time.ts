import { parseISO, format, isAfter, isBefore, addMinutes } from 'date-fns';
import { enUS } from 'date-fns/locale';

/**
 * Converts stored fest times (`HH:mm` 24h) to English 12-hour with AM/PM.
 * Implemented without parsing through Date so display never depends on date-fns
 * locale bundle quirks or TZ in production.
 */
export function formatTime12(timeStr: string): string {
  const s = timeStr.trim().replace(/^[\u200B-\u200D\uFEFF]+|[\u200B-\u200D\uFEFF]+$/g, '');
  const m = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(s);
  if (!m) return timeStr.trim();
  const hour24 = Number(m[1]);
  const minute = m[2];
  if (m[3] !== undefined) {
    const sec = Number(m[3]);
    if (Number.isNaN(sec) || sec > 59) return timeStr.trim();
  }
  if (
    Number.isNaN(hour24) ||
    Number.isNaN(Number(minute)) ||
    hour24 < 0 ||
    hour24 > 23 ||
    Number(minute) > 59
  ) {
    return timeStr.trim();
  }
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  let h12 = hour24 % 12;
  if (h12 === 0) h12 = 12;
  return `${h12}:${minute} ${ampm}`;
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
