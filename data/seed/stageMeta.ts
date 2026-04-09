/** Maps performance stage ids to display names + map zones (same 5 field stages as map seed). */
export const STAGE_META: Record<
  string,
  { stageName: string; mapZoneId: string }
> = {
  st_acura: { stageName: 'Acura Stage', mapZoneId: 'mz_acura' },
  st_gentilly: { stageName: 'Gentilly Stage', mapZoneId: 'mz_gentilly' },
  st_blues: { stageName: 'Blues Tent', mapZoneId: 'mz_blues' },
  st_jazz: { stageName: 'Jazz Tent', mapZoneId: 'mz_jazz' },
  st_fais: { stageName: 'Fais Do-Do Stage', mapZoneId: 'mz_fais' },
};
