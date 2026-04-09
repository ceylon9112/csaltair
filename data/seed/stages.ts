import type { Stage } from '@/types/models';

export const SEED_STAGES: Stage[] = [
  {
    id: 'st_acura',
    name: 'Acura Stage',
    description: 'Main field stage — large headline performances.',
    mapZoneId: 'mz_acura',
  },
  {
    id: 'st_gentilly',
    name: 'Gentilly Stage',
    description: 'Rock, soul, and contemporary acts.',
    mapZoneId: 'mz_gentilly',
  },
  {
    id: 'st_blues',
    name: 'Blues Tent',
    description: 'Intimate tent for blues and roots music.',
    mapZoneId: 'mz_blues',
  },
  {
    id: 'st_jazz',
    name: 'Jazz Tent',
    description: 'Traditional and modern jazz programming.',
    mapZoneId: 'mz_jazz',
  },
  {
    id: 'st_fais',
    name: 'Fais Do-Do Stage',
    description: 'Louisiana French music, Cajun, and zydeco.',
    mapZoneId: 'mz_fais',
  },
];
