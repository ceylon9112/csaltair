import { format, parseISO } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import type { Performance } from '@/types/models';
import { currentFestivalDayOrDefault, formatDayLabel } from '@/utils/festivalDates';
import { formatPerformanceRange, isPerformanceHappeningNow, isStartingWithinMinutes } from '@/utils/time';

import { usePreferencesStore } from '@/store/preferencesStore';

import { WeatherWidget } from '../components/WeatherWidget';

export function HomePage() {
  const { data, isLoading, isError } = useContentBundle();
  const lastSyncedAt = usePreferencesStore((s) => s.lastSyncedAt);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const festDay = currentFestivalDayOrDefault(new Date());

  const { happening, soon, activeAlert } = useMemo(() => {
    void tick;
    const now = new Date();
    if (!data) {
      return { happening: [] as Performance[], soon: [] as Performance[], activeAlert: null as null };
    }
    const happening = data.performances.filter((p) =>
      isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now)
    );
    const soon = data.performances.filter(
      (p) =>
        !isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now) &&
        isStartingWithinMinutes(p.date, p.startTime, 60, now)
    );
    const alerts = data.alerts.filter(
      (a) => now >= parseISO(a.effectiveAt) && now <= parseISO(a.expiresAt)
    );
    return { happening, soon, activeAlert: alerts[0] ?? null };
  }, [data, tick]);

  if (isLoading || !data) {
    return (
      <div className="page">
        <p>Loading festival content…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <p>Could not load content.</p>
      </div>
    );
  }

  const bundle = contentRepository.getBundleSync();

  return (
    <div className="page">
      <header className="fest-hero">
        <p className="fest-kicker">Live music · Fairgrounds energy · NOLA soul</p>
        <h1 className="title">New Orleans Jazz &amp; Heritage Festival</h1>
        <p className="muted" style={{ margin: 0 }}>
          Today on site: <strong>{formatDayLabel(festDay)}</strong>
        </p>
        <p className="caption" style={{ marginTop: '0.5rem' }}>
          Jazz Fest 2026 · Guest mode · offline-ready
        </p>
        {lastSyncedAt ? (
          <p className="caption">Content cached: {format(parseISO(lastSyncedAt), 'MMM d, h:mm a')}</p>
        ) : null}
      </header>

      <WeatherWidget />

      {activeAlert ? (
        <div className="card" style={{ borderLeft: `4px solid var(--brass)` }}>
          <div className="subtitle">{activeAlert.title}</div>
          <p>{activeAlert.body}</p>
        </div>
      ) : null}

      <div className="card">
        <div className="subtitle">Happening now</div>
        {happening.length === 0 ? (
          <p className="muted">No performances in this window (sample data).</p>
        ) : (
          <div className="stack">
            {happening.map((p) => {
              const artist = bundle.artists.find((a) => a.id === p.artistId);
              return (
                <Link key={p.id} to={`/performance/${p.id}`}>
                  <strong>{artist?.name ?? 'Artist'}</strong>
                  <div className="caption">
                    {p.stageName} · {p.startTime}–{p.endTime}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="card">
        <div className="subtitle">Starting soon (60 min)</div>
        {soon.length === 0 ? (
          <p className="muted">Nothing in the next hour on the sample clock.</p>
        ) : (
          <div className="stack">
            {soon.map((p) => {
              const artist = bundle.artists.find((a) => a.id === p.artistId);
              return (
                <Link key={p.id} to={`/performance/${p.id}`}>
                  <strong>{artist?.name ?? 'Artist'}</strong>
                  <div className="caption">{formatPerformanceRange(p.date, p.startTime, p.endTime)}</div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <p className="caption" style={{ marginTop: 24 }}>
        Quick links: <Link to="/lineup">Lineup</Link> · <Link to="/map">Map</Link> ·{' '}
        <Link to="/schedule">My schedule</Link> · <Link to="/info">Info</Link>
      </p>
    </div>
  );
}
