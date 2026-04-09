import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';

export function ArtistPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const artist = bundle?.artists.find((a) => a.id === id);
  const [bioOpen, setBioOpen] = useState(false);

  if (!bundle || !artist) {
    return (
      <div className="page">
        <p>Artist not found.</p>
        <button type="button" className="btn secondary" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  const performances = bundle.performances.filter((p) => artist.performanceIds.includes(p.id));

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
      <p style={{ color: 'var(--tint)', fontWeight: 600 }}>{artist.genre}</p>

      <div className="card">
        <button type="button" className="btn secondary" style={{ width: '100%' }} onClick={() => setBioOpen((o) => !o)}>
          Bio {bioOpen ? '−' : '+'}
        </button>
        {bioOpen ? <p style={{ marginTop: 12 }}>{artist.shortBio}</p> : <p className="muted">{artist.shortBio.slice(0, 120)}…</p>}
      </div>

      <div className="card">
        <div className="subtitle">Discography</div>
        <ul>
          {artist.discography.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>

      <div className="card">
        <div className="subtitle">Performances</div>
        <div className="stack">
          {performances.map((p) => (
            <Link key={p.id} to={`/performance/${p.id}`}>
              {p.stageName} · {p.startTime}–{p.endTime}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
