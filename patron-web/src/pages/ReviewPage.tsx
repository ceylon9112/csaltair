import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useContentBundle } from '@/hooks/useContentQuery';
import { contentRepository } from '@/services/content/ContentRepository';
import { REVIEW_NOTE_MAX, useReviewStore } from '@/store/reviewStore';

export function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const perf = bundle?.performances.find((p) => p.id === id);
  const artist = perf ? bundle?.artists.find((a) => a.id === perf.artistId) : undefined;
  const existing = useReviewStore((s) => (id ? s.reviews[id] : undefined));
  const upsertReview = useReviewStore((s) => s.upsertReview);

  const [rating, setRating] = useState(existing?.rating ?? 4);
  const [note, setNote] = useState(existing?.note ?? '');

  if (!bundle || !perf || !artist || !id) {
    return (
      <div className="page">
        <p>Performance not found.</p>
        <Link to="/lineup">Lineup</Link>
      </div>
    );
  }

  const remaining = REVIEW_NOTE_MAX - note.length;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!id) return;
    upsertReview(id, rating, note);
    window.alert('Review saved on this device.');
    navigate(`/performance/${id}`);
  }

  return (
    <div className="page">
      <h1 className="title">Your review</h1>
      <p className="muted">
        {artist.name} · {perf.startTime} — private on this device only.
      </p>

      <form onSubmit={onSubmit}>
        <p className="caption" style={{ marginTop: 16 }}>
          Stars (1–5)
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={rating === n ? 'btn' : 'btn secondary'}
              onClick={() => setRating(n)}
              style={{ minWidth: 48 }}>
              {n}
            </button>
          ))}
        </div>

        <label className="caption" style={{ display: 'block', marginTop: 24 }} htmlFor="note">
          Note (optional, {remaining} chars left)
        </label>
        <textarea
          id="note"
          className="input"
          rows={4}
          maxLength={REVIEW_NOTE_MAX}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          style={{ resize: 'vertical' }}
        />

        <button type="submit" className="btn" style={{ marginTop: 16 }}>
          Save review
        </button>
      </form>

      <p style={{ marginTop: 24 }}>
        <Link to={`/performance/${id}`}>Back to performance</Link>
      </p>
    </div>
  );
}
