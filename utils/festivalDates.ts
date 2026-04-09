import { parseISO, format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

export const FESTIVAL_WEEK1 = ['2026-04-23', '2026-04-24', '2026-04-25', '2026-04-26'] as const;
export const FESTIVAL_WEEK2 = ['2026-04-30', '2026-05-01', '2026-05-02', '2026-05-03'] as const;

export const ALL_FESTIVAL_DAYS = [...FESTIVAL_WEEK1, ...FESTIVAL_WEEK2];

export function formatDayLabel(iso: string): string {
  return format(parseISO(iso), 'EEE, MMM d');
}

/** If `day` is during the festival, return it; else return first fest day (for home). */
export function currentFestivalDayOrDefault(now: Date = new Date()): string {
  for (const d of ALL_FESTIVAL_DAYS) {
    const sd = startOfDay(parseISO(d));
    const ed = endOfDay(parseISO(d));
    if (isWithinInterval(now, { start: sd, end: ed })) return d;
  }
  const first = parseISO(ALL_FESTIVAL_DAYS[0]);
  const last = endOfDay(parseISO(ALL_FESTIVAL_DAYS[ALL_FESTIVAL_DAYS.length - 1]));
  if (now < first) return ALL_FESTIVAL_DAYS[0];
  if (now > last) return ALL_FESTIVAL_DAYS[ALL_FESTIVAL_DAYS.length - 1];
  return ALL_FESTIVAL_DAYS[0];
}
