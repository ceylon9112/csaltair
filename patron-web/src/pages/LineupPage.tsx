import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import type { Performance } from '@/types/models';
import { ALL_FESTIVAL_DAYS, formatDayLabel } from '@/utils/festivalDates';
import {
  formatPerformanceRange,
  isPerformanceHappeningNow,
  isStartingWithinMinutes,
} from '@/utils/time';
import { findOverlapsFor } from '@/utils/overlap';
import { useScheduleStore } from '@/store/scheduleStore';

type Segment = 'now' | 'soon' | 'full';

export function LineupPage() {
  const { data, isLoading } = useContentBundle();
  const saved = useScheduleStore((s) => s.saved);
  const [day, setDay] = useState(ALL_FESTIVAL_DAYS[0]);
  const [stageId, setStageId] = useState<string | null>(null);
  const [segment, setSegment] = useState<Segment>('full');
  const [q, setQ] = useState('');

  const bundle = data ? contentRepository.getBundleSync() : null;

  const filtered = useMemo(() => {
    if (!bundle) return [];
    let list = bundle.performances.filter((p) => p.date === day);
    if (stageId) list = list.filter((p) => p.stageId === stageId);
    const now = new Date();
    if (segment === 'now') {
      list = list.filter((p) => isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now));
    } else if (segment === 'soon') {
      list = list.filter((p) => isStartingWithinMinutes(p.date, p.startTime, 90, now));
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((p) => {
        const a = bundle.artists.find((x) => x.id === p.artistId);
        return a?.name.toLowerCase().includes(needle);
      });
    }
    return [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [bundle, day, stageId, segment, q]);

  const artistResults = useMemo(() => {
    if (!bundle || !q.trim()) return [];
    const needle = q.trim().toLowerCase();
    return bundle.artists.filter((a) => a.name.toLowerCase().includes(needle)).slice(0, 20);
  }, [bundle, q]);

  function conflictFor(p: Performance): boolean {
    if (!bundle) return false;
    const savedPerfs = Object.keys(saved)
      .map((id) => bundle.performances.find((x) => x.id === id))
      .filter(Boolean) as Performance[];
    return findOverlapsFor(p, savedPerfs).length > 0;
  }

  if (isLoading || !bundle) {
    return (
      <div className="page">
        <p>Loading lineup…</p>
      </div>
    );
  }

  const stages = bundle.stages;

  return (
    <div className="page">
      <h1 className="title">Lineup</h1>
      <input
        className="input"
        placeholder="Search artists"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        aria-label="Search artists"
      />

      {artistResults.length > 0 && q.trim() ? (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="subtitle">Artists</div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {artistResults.map((a) => (
              <li key={a.id}>
                <Link to={`/artist/${a.id}`}>{a.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {ALL_FESTIVAL_DAYS.map((d) => (
          <button
            key={d}
            type="button"
            className={d === day ? 'btn' : 'btn secondary'}
            onClick={() => setDay(d)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            {formatDayLabel(d)}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['full', 'now', 'soon'] as const).map((s) => (
          <button
            key={s}
            type="button"
            className={segment === s ? 'btn' : 'btn secondary'}
            onClick={() => setSegment(s)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
            {s === 'full' ? 'All day' : s === 'now' ? 'Now' : 'Soon'}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 12 }}>
        <label className="caption" htmlFor="stage-filter">
          Stage
        </label>
        <select
          id="stage-filter"
          className="input"
          value={stageId ?? ''}
          onChange={(e) => setStageId(e.target.value || null)}
          style={{ marginTop: 4 }}>
          <option value="">All stages</option>
          {stages.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 20 }} className="stack">
        {filtered.map((p) => {
          const artist = bundle.artists.find((a) => a.id === p.artistId);
          const c = conflictFor(p);
          return (
            <div key={p.id} className="card" style={c ? { borderColor: 'var(--danger)' } : undefined}>
              <Link to={`/performance/${p.id}`}>
                <strong>{artist?.name ?? 'Artist'}</strong>
              </Link>
              <div className="caption">
                {p.stageName} · {formatPerformanceRange(p.date, p.startTime, p.endTime)}
              </div>
              {c ? <div className="caption" style={{ color: 'var(--danger)' }}>Overlaps a saved show</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
