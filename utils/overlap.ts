import type { Performance } from '@/types/models';

import { performanceToDate } from './time';

function minutesOfDay(d: Date): number {
  return d.getHours() * 60 + d.getMinutes();
}

/** Whether two performances on the same calendar day overlap in time. */
export function performancesOverlap(a: Performance, b: Performance): boolean {
  if (a.date !== b.date) return false;
  const a0 = performanceToDate(a.date, a.startTime);
  const a1 = performanceToDate(a.date, a.endTime);
  const b0 = performanceToDate(b.date, b.startTime);
  const b1 = performanceToDate(b.date, b.endTime);
  return a0 < b1 && b0 < a1;
}

/** Find other saved performances that conflict with `p` (same day overlap). */
export function findOverlapsFor(
  p: Performance,
  others: Performance[]
): Performance[] {
  return others.filter((o) => o.id !== p.id && performancesOverlap(p, o));
}
