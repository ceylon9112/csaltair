import type { ContentBundle } from '@/types/models';

import { SEED_ALERTS } from './alerts';
import { SEED_ARTISTS } from './artists';
import { SEED_INFO } from './infoSections';
import { SEED_MAP_ZONES } from './mapZones';
import { SEED_PERFORMANCES } from './performances';
import { SEED_STAGES } from './stages';
import { SEED_TICKETS } from './tickets';

/** Bumped when lineup/schedule seed data changes materially. */
export const CONTENT_VERSION = '2026.nojazzfest-style.full-lineup.6';

export function getSeedBundle(): ContentBundle {
  return {
    artists: SEED_ARTISTS,
    performances: SEED_PERFORMANCES,
    stages: SEED_STAGES,
    mapZones: SEED_MAP_ZONES,
    ticketTypes: SEED_TICKETS,
    infoSections: SEED_INFO,
    alerts: SEED_ALERTS,
    contentVersion: CONTENT_VERSION,
  };
}

export {
  SEED_ALERTS,
  SEED_ARTISTS,
  SEED_INFO,
  SEED_MAP_ZONES,
  SEED_PERFORMANCES,
  SEED_STAGES,
  SEED_TICKETS,
};
