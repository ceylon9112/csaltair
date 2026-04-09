import type { Performance } from '@/types/models';

import { findOverlapsFor, performancesOverlap } from '@/utils/overlap';

const base = (partial: Partial<Performance> & Pick<Performance, 'id' | 'date'>): Performance => ({
  artistId: 'a1',
  stageId: 's1',
  stageName: 'Stage',
  mapZoneId: 'z1',
  startTime: '12:00',
  endTime: '13:00',
  ...partial,
});

describe('performancesOverlap', () => {
  it('detects overlap on same day', () => {
    const a = base({ id: '1', date: '2026-04-23', startTime: '12:00', endTime: '13:00' });
    const b = base({ id: '2', date: '2026-04-23', startTime: '12:30', endTime: '13:30' });
    expect(performancesOverlap(a, b)).toBe(true);
  });

  it('no overlap different days', () => {
    const a = base({ id: '1', date: '2026-04-23', startTime: '12:00', endTime: '13:00' });
    const b = base({ id: '2', date: '2026-04-24', startTime: '12:30', endTime: '13:30' });
    expect(performancesOverlap(a, b)).toBe(false);
  });
});

describe('findOverlapsFor', () => {
  it('returns conflicting performances', () => {
    const target = base({ id: 't', date: '2026-04-23', startTime: '14:00', endTime: '15:00' });
    const other = base({ id: 'o', date: '2026-04-23', startTime: '14:30', endTime: '15:30' });
    expect(findOverlapsFor(target, [other])).toHaveLength(1);
  });
});
