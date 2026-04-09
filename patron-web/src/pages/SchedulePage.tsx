import { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useReviewStore } from '@/store/reviewStore';
import { useScheduleStore } from '@/store/scheduleStore';
import type { Performance } from '@/types/models';
import { ALL_FESTIVAL_DAYS, formatDayLabel } from '@/utils/festivalDates';
import { formatPerformanceRange } from '@/utils/time';

export function SchedulePage() {
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const saved = useScheduleStore((s) => s.saved);
  const removePerformance = useScheduleStore((s) => s.removePerformance);
  const reviews = useReviewStore((s) => s.reviews);
  const defaultRem = usePreferencesStore((s) => s.reminderDefaultMinutes);

  const grouped = useMemo(() => {
    if (!bundle) return [];
    const entries = Object.keys(saved)
      .map((id) => bundle.performances.find((p) => p.id === id))
      .filter(Boolean) as Performance[];
    const byDay: Record<string, Performance[]> = {};
    for (const d of ALL_FESTIVAL_DAYS) byDay[d] = [];
    for (const p of entries) {
      byDay[p.date] = byDay[p.date] ?? [];
      byDay[p.date].push(p);
    }
    return ALL_FESTIVAL_DAYS.map((d) => ({
      day: d,
      items: (byDay[d] ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    })).filter((g) => g.items.length > 0);
  }, [bundle, saved]);

  if (!bundle) {
    return (
      <div className="page">
        <p>Loading…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="title">My schedule</h1>
      <p className="muted">Saved in this browser · reminders are native-only in the Expo app</p>
      <p className="caption">Default reminder when saving elsewhere: {defaultRem} min</p>

      {grouped.length === 0 ? (
        <div className="card" style={{ textAlign: 'center' }}>
          <p className="subtitle">No saved shows yet</p>
          <p className="muted">Browse the lineup and open a performance to save it.</p>
          <Link to="/lineup" className="btn" style={{ marginTop: 16, display: 'inline-flex' }}>
            Browse lineup
          </Link>
        </div>
      ) : (
        grouped.map((g) => (
          <section key={g.day}>
            <h2 className="subtitle">{formatDayLabel(g.day)}</h2>
            {g.items.map((p) => {
              const artist = bundle.artists.find((a) => a.id === p.artistId);
              const rev = reviews[p.id];
              return (
                <div key={p.id} className="card">
                  <Link to={`/performance/${p.id}`}>
                    <strong>{artist?.name ?? 'Artist'}</strong>
                  </Link>
                  <div className="caption">{formatPerformanceRange(p.date, p.startTime, p.endTime)}</div>
                  <div className="caption">{p.stageName}</div>
                  {rev ? (
                    <p className="caption">
                      Your review: {rev.rating}★ {rev.note ? `— ${rev.note}` : ''}
                    </p>
                  ) : null}
                  <button type="button" className="btn secondary" style={{ marginTop: 8 }} onClick={() => void removePerformance(p.id)}>
                    Remove
                  </button>
                </div>
              );
            })}
          </section>
        ))
      )}
    </div>
  );
}
