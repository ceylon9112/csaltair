import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useScheduleStore } from '@/store/scheduleStore';
import { formatPerformanceRange } from '@/utils/time';
import { findOverlapsFor } from '@/utils/overlap';

export function PerformancePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const savePerformance = useScheduleStore((s) => s.savePerformance);
  const removePerformance = useScheduleStore((s) => s.removePerformance);
  const savedMap = useScheduleStore((s) => s.saved);
  const defaultRem = usePreferencesStore((s) => s.reminderDefaultMinutes);

  const perf = bundle?.performances.find((p) => p.id === id);
  const artist = perf ? bundle?.artists.find((a) => a.id === perf.artistId) : undefined;
  const zone = perf ? bundle?.mapZones.find((z) => z.id === perf.mapZoneId) : undefined;
  const saved = perf ? !!savedMap[perf.id] : false;

  const overlaps = useMemo(() => {
    if (!bundle || !perf) return [];
    const savedPerfs = Object.keys(savedMap)
      .map((pid) => bundle.performances.find((x) => x.id === pid))
      .filter(Boolean)
      .filter((p) => p!.id !== perf.id) as typeof bundle.performances;
    return findOverlapsFor(perf, savedPerfs);
  }, [bundle, perf, savedMap]);

  if (!bundle || !perf || !artist) {
    return (
      <div className="page">
        <p>Performance not found.</p>
        <button type="button" className="btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  async function onSave() {
    if (!perf || !artist) return;
    try {
      await savePerformance(perf, defaultRem, artist.name);
      window.alert('Saved to your schedule (this browser).');
    } catch {
      window.alert('Could not save — try again.');
    }
  }

  return (
    <div className="page">
      <button type="button" className="btn secondary" style={{ marginBottom: 12 }} onClick={() => navigate(-1)}>
        ← Back
      </button>
      <img
        src={artist.imageUrl}
        alt=""
        style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 12 }}
      />
      <h1 className="title" style={{ marginTop: 16 }}>
        {artist.name}
      </h1>
      <p className="muted">{artist.genre}</p>
      <p>{formatPerformanceRange(perf.date, perf.startTime, perf.endTime)}</p>
      <p>{perf.stageName}</p>
      <p className="caption">Map zone: {zone?.name ?? perf.mapZoneId}</p>

      {overlaps.length ? (
        <div className="card" style={{ borderColor: 'var(--danger)' }}>
          <strong style={{ color: 'var(--danger)' }}>Overlap:</strong> you have another saved show at this time.
        </div>
      ) : null}

      <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {saved ? (
          <button type="button" className="btn secondary" onClick={() => void removePerformance(perf.id)}>
            Remove from schedule
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => void onSave()}>
            Save to My Schedule
          </button>
        )}
        <Link to={`/performance/${perf.id}/review`} className="btn secondary">
          Rate this set
        </Link>
      </div>

      <p className="caption" style={{ marginTop: 16 }}>
        <Link to={`/artist/${artist.id}`}>Artist profile</Link> · <Link to="/lineup">Back to lineup</Link>
      </p>
    </div>
  );
}
