import { useState } from 'react';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import type { MapZone } from '@/types/models';

import { WebMapSvg } from '../components/WebMapSvg';

export function MapPage() {
  const { data, isLoading } = useContentBundle();
  const [selected, setSelected] = useState<MapZone | null>(null);
  const bundle = data ? contentRepository.getBundleSync() : null;

  if (isLoading || !bundle) {
    return (
      <div className="page">
        <p>Loading map…</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="title">Festival map</h1>
      <p className="muted">Static map — no GPS. Shared seed data with the Expo app.</p>
      <WebMapSvg />
      <ul className="stack" style={{ listStyle: 'none', padding: 0 }}>
        {bundle.mapZones.map((z) => (
          <li key={z.id}>
            <button
              type="button"
              className="btn secondary"
              style={{ width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
              onClick={() => setSelected(z)}>
              {z.name} <span className="caption">({z.type})</span>
            </button>
          </li>
        ))}
      </ul>
      {selected ? (
        <div className="card" style={{ marginTop: 12 }}>
          <div className="subtitle">{selected.name}</div>
          <p>{selected.detailText}</p>
          {selected.accessibilityTags?.length ? (
            <p className="caption">Tags: {selected.accessibilityTags.join(', ')}</p>
          ) : null}
          <button type="button" className="btn secondary" onClick={() => setSelected(null)}>
            Close
          </button>
        </div>
      ) : null}
    </div>
  );
}
