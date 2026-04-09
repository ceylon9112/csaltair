import type { Artist } from '@/types/models';

import { ARTIST_GENRE_BY_ID } from './artistGenres';
import { ARTIST_REGISTRY } from './artistRegistry';
import { SEED_PERFORMANCES } from './performances';

const idsByArtist = new Map<string, string[]>();
for (const p of SEED_PERFORMANCES) {
  const list = idsByArtist.get(p.artistId) ?? [];
  list.push(p.id);
  idsByArtist.set(p.artistId, list);
}

/** Artists who appear in at least one performance, with `performanceIds` wired automatically. */
export const SEED_ARTISTS: Artist[] = ARTIST_REGISTRY.filter((a) => idsByArtist.has(a.id)).map(
  (a) => ({
    ...a,
    genre: ARTIST_GENRE_BY_ID[a.id] ?? a.genre,
    performanceIds: idsByArtist.get(a.id) ?? [],
  })
);
