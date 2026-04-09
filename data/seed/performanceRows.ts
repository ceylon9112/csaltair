import type { Performance } from '@/types/models';

import { STAGE_META } from './stageMeta';

type StageKey = keyof typeof STAGE_META;

const R: Array<{
  id: string;
  artistId: string;
  date: string;
  start: string;
  end: string;
  stage: StageKey;
}> = [
  // —— Weekend 1: Thu Apr 23 ——
  { id: 'pf_20260423_001', artistId: 'ar_kings_leon', date: '2026-04-23', start: '18:45', end: '20:30', stage: 'st_acura' },
  { id: 'pf_20260423_002', artistId: 'ar_preservation', date: '2026-04-23', start: '13:00', end: '14:15', stage: 'st_jazz' },
  { id: 'pf_20260423_003', artistId: 'ar_stephen_marley', date: '2026-04-23', start: '16:00', end: '17:45', stage: 'st_gentilly' },
  { id: 'pf_20260423_004', artistId: 'ar_raye', date: '2026-04-23', start: '15:00', end: '16:15', stage: 'st_acura' },
  { id: 'pf_20260423_005', artistId: 'ar_blind_boys', date: '2026-04-23', start: '12:00', end: '13:15', stage: 'st_blues' },
  { id: 'pf_20260423_006', artistId: 'ar_cowboy_mouth', date: '2026-04-23', start: '14:30', end: '15:45', stage: 'st_gentilly' },
  { id: 'pf_20260423_007', artistId: 'ar_charlie_musselwhite', date: '2026-04-23', start: '13:30', end: '14:30', stage: 'st_blues' },
  { id: 'pf_20260423_008', artistId: 'ar_cimafunk', date: '2026-04-23', start: '15:15', end: '16:15', stage: 'st_fais' },
  { id: 'pf_20260423_009', artistId: 'ar_nicholas_payton', date: '2026-04-23', start: '14:00', end: '15:30', stage: 'st_jazz' },
  { id: 'pf_20260423_010', artistId: 'ar_donald_harrison', date: '2026-04-23', start: '16:30', end: '17:45', stage: 'st_jazz' },
  { id: 'pf_20260423_011', artistId: 'ar_kenny_neal', date: '2026-04-23', start: '11:45', end: '12:45', stage: 'st_blues' },
  { id: 'pf_20260423_012', artistId: 'ar_shinyribs', date: '2026-04-23', start: '17:00', end: '18:15', stage: 'st_fais' },
  { id: 'pf_20260423_013', artistId: 'ar_brass_a_holics', date: '2026-04-23', start: '11:30', end: '12:30', stage: 'st_fais' },

  // —— Fri Apr 24 ——
  { id: 'pf_20260424_001', artistId: 'ar_jon_batiste', date: '2026-04-24', start: '18:45', end: '20:30', stage: 'st_acura' },
  { id: 'pf_20260424_002', artistId: 'ar_lorde', date: '2026-04-24', start: '17:00', end: '18:30', stage: 'st_gentilly' },
  { id: 'pf_20260424_003', artistId: 'ar_sean_paul', date: '2026-04-24', start: '15:30', end: '16:45', stage: 'st_gentilly' },
  { id: 'pf_20260424_004', artistId: 'ar_big_freedia', date: '2026-04-24', start: '16:00', end: '17:00', stage: 'st_fais' },
  { id: 'pf_20260424_005', artistId: 'ar_ani', date: '2026-04-24', start: '14:00', end: '15:15', stage: 'st_blues' },
  { id: 'pf_20260424_006', artistId: 'ar_cyril_neville', date: '2026-04-24', start: '15:00', end: '16:30', stage: 'st_jazz' },
  { id: 'pf_20260424_007', artistId: 'ar_lil_ed', date: '2026-04-24', start: '12:30', end: '13:45', stage: 'st_blues' },
  { id: 'pf_20260424_008', artistId: 'ar_dozen_brass', date: '2026-04-24', start: '13:00', end: '14:30', stage: 'st_jazz' },
  { id: 'pf_20260424_009', artistId: 'ar_preservation', date: '2026-04-24', start: '11:45', end: '12:45', stage: 'st_jazz' },
  { id: 'pf_20260424_010', artistId: 'ar_brass_a_holics', date: '2026-04-24', start: '11:30', end: '12:30', stage: 'st_fais' },

  // —— Sat Apr 25 ——
  { id: 'pf_20260425_001', artistId: 'ar_stevie_nicks', date: '2026-04-25', start: '18:45', end: '20:30', stage: 'st_acura' },
  { id: 'pf_20260425_002', artistId: 'ar_tyler_childers', date: '2026-04-25', start: '17:00', end: '18:30', stage: 'st_gentilly' },
  { id: 'pf_20260425_003', artistId: 'ar_nas', date: '2026-04-25', start: '16:00', end: '17:15', stage: 'st_gentilly' },
  { id: 'pf_20260425_004', artistId: 'ar_jason_isbell', date: '2026-04-25', start: '15:00', end: '16:15', stage: 'st_acura' },
  { id: 'pf_20260425_005', artistId: 'ar_rhiannon', date: '2026-04-25', start: '14:00', end: '15:30', stage: 'st_jazz' },
  { id: 'pf_20260425_006', artistId: 'ar_revivalists', date: '2026-04-25', start: '14:30', end: '16:00', stage: 'st_gentilly' },
  { id: 'pf_20260425_007', artistId: 'ar_bruce_hornsby', date: '2026-04-25', start: '13:00', end: '14:15', stage: 'st_blues' },
  { id: 'pf_20260425_008', artistId: 'ar_burning_spear', date: '2026-04-25', start: '17:00', end: '18:30', stage: 'st_fais' },
  { id: 'pf_20260425_009', artistId: 'ar_samantha_fish', date: '2026-04-25', start: '12:00', end: '13:00', stage: 'st_blues' },
  { id: 'pf_20260425_010', artistId: 'ar_kermit', date: '2026-04-25', start: '15:00', end: '16:15', stage: 'st_fais' },
  { id: 'pf_20260425_011', artistId: 'ar_sonny_landreth', date: '2026-04-25', start: '11:45', end: '12:45', stage: 'st_blues' },
  { id: 'pf_20260425_012', artistId: 'ar_dwayne_dopsie', date: '2026-04-25', start: '13:30', end: '14:45', stage: 'st_fais' },

  // —— Sun Apr 26 ——
  { id: 'pf_20260426_001', artistId: 'ar_rod_stewart', date: '2026-04-26', start: '18:30', end: '20:15', stage: 'st_acura' },
  { id: 'pf_20260426_002', artistId: 'ar_david_byrne', date: '2026-04-26', start: '17:00', end: '18:30', stage: 'st_gentilly' },
  { id: 'pf_20260426_003', artistId: 'ar_st_vincent', date: '2026-04-26', start: '16:00', end: '17:30', stage: 'st_jazz' },
  { id: 'pf_20260426_004', artistId: 'ar_irma', date: '2026-04-26', start: '15:00', end: '16:15', stage: 'st_blues' },
  { id: 'pf_20260426_005', artistId: 'ar_widespread_panic', date: '2026-04-26', start: '15:30', end: '18:00', stage: 'st_gentilly' },
  { id: 'pf_20260426_006', artistId: 'ar_lake_street', date: '2026-04-26', start: '13:30', end: '15:00', stage: 'st_blues' },
  { id: 'pf_20260426_007', artistId: 'ar_lettuce', date: '2026-04-26', start: '14:00', end: '15:30', stage: 'st_jazz' },
  { id: 'pf_20260426_008', artistId: 'ar_leela_james', date: '2026-04-26', start: '13:00', end: '14:15', stage: 'st_gentilly' },
  { id: 'pf_20260426_009', artistId: 'ar_alejandro', date: '2026-04-26', start: '12:00', end: '13:15', stage: 'st_fais' },
  { id: 'pf_20260426_010', artistId: 'ar_terence_blanchard', date: '2026-04-26', start: '12:30', end: '13:45', stage: 'st_jazz' },
  { id: 'pf_20260426_011', artistId: 'ar_shemekia', date: '2026-04-26', start: '11:45', end: '12:45', stage: 'st_blues' },

  // —— Thu Apr 30 (W2) ——
  { id: 'pf_20260430_001', artistId: 'ar_widespread_panic', date: '2026-04-30', start: '18:00', end: '20:00', stage: 'st_acura' },
  { id: 'pf_20260430_002', artistId: 'ar_lake_street', date: '2026-04-30', start: '17:00', end: '18:30', stage: 'st_gentilly' },
  { id: 'pf_20260430_003', artistId: 'ar_lettuce', date: '2026-04-30', start: '15:30', end: '17:00', stage: 'st_gentilly' },
  { id: 'pf_20260430_004', artistId: 'ar_cassandra', date: '2026-04-30', start: '14:00', end: '15:30', stage: 'st_jazz' },
  { id: 'pf_20260430_005', artistId: 'ar_leela_james', date: '2026-04-30', start: '13:00', end: '14:15', stage: 'st_blues' },
  { id: 'pf_20260430_006', artistId: 'ar_alejandro', date: '2026-04-30', start: '15:00', end: '16:15', stage: 'st_fais' },
  { id: 'pf_20260430_007', artistId: 'ar_preservation', date: '2026-04-30', start: '12:00', end: '13:00', stage: 'st_jazz' },
  { id: 'pf_20260430_008', artistId: 'ar_brass_a_holics', date: '2026-04-30', start: '11:30', end: '12:30', stage: 'st_fais' },

  // —— Fri May 1 ——
  { id: 'pf_20260501_001', artistId: 'ar_lainey_wilson', date: '2026-05-01', start: '18:45', end: '20:15', stage: 'st_acura' },
  { id: 'pf_20260501_002', artistId: 'ar_black_keys', date: '2026-05-01', start: '17:00', end: '18:30', stage: 'st_gentilly' },
  { id: 'pf_20260501_003', artistId: 'ar_ziggy', date: '2026-05-01', start: '16:00', end: '17:30', stage: 'st_fais' },
  { id: 'pf_20260501_004', artistId: 'ar_rickie_lee', date: '2026-05-01', start: '15:00', end: '16:15', stage: 'st_jazz' },
  { id: 'pf_20260501_005', artistId: 'ar_tab_benoit', date: '2026-05-01', start: '13:00', end: '14:15', stage: 'st_blues' },
  { id: 'pf_20260501_006', artistId: 'ar_shemekia', date: '2026-05-01', start: '14:30', end: '15:45', stage: 'st_blues' },
  { id: 'pf_20260501_007', artistId: 'ar_dozen_brass', date: '2026-05-01', start: '12:00', end: '13:15', stage: 'st_jazz' },
  { id: 'pf_20260501_008', artistId: 'ar_kermit', date: '2026-05-01', start: '11:45', end: '12:45', stage: 'st_fais' },

  // —— Sat May 2 ——
  { id: 'pf_20260502_001', artistId: 'ar_eagles', date: '2026-05-02', start: '18:45', end: '20:45', stage: 'st_acura' },
  { id: 'pf_20260502_002', artistId: 'ar_alabama_shakes', date: '2026-05-02', start: '16:30', end: '18:00', stage: 'st_gentilly' },
  { id: 'pf_20260502_003', artistId: 'ar_tpain', date: '2026-05-02', start: '17:00', end: '18:15', stage: 'st_fais' },
  { id: 'pf_20260502_004', artistId: 'ar_dianne_reeves', date: '2026-05-02', start: '15:00', end: '16:30', stage: 'st_jazz' },
  { id: 'pf_20260502_005', artistId: 'ar_big_freedia', date: '2026-05-02', start: '14:00', end: '15:15', stage: 'st_gentilly' },
  { id: 'pf_20260502_006', artistId: 'ar_dumpstaphunk', date: '2026-05-02', start: '13:30', end: '15:00', stage: 'st_blues' },
  { id: 'pf_20260502_007', artistId: 'ar_little_feat', date: '2026-05-02', start: '14:00', end: '15:30', stage: 'st_fais' },
  { id: 'pf_20260502_008', artistId: 'ar_sierra_hull', date: '2026-05-02', start: '12:00', end: '13:15', stage: 'st_jazz' },
  { id: 'pf_20260502_009', artistId: 'ar_soul_rebels', date: '2026-05-02', start: '12:30', end: '13:45', stage: 'st_gentilly' },
  { id: 'pf_20260502_010', artistId: 'ar_anders_osborne', date: '2026-05-02', start: '11:45', end: '12:45', stage: 'st_blues' },
  { id: 'pf_20260502_011', artistId: 'ar_irma_gospel', date: '2026-05-02', start: '16:00', end: '17:15', stage: 'st_jazz' },
  { id: 'pf_20260502_012', artistId: 'ar_corey_henry', date: '2026-05-02', start: '15:00', end: '16:15', stage: 'st_gentilly' },
  { id: 'pf_20260502_013', artistId: 'ar_leo_nocentelli', date: '2026-05-02', start: '14:30', end: '15:45', stage: 'st_fais' },
  { id: 'pf_20260502_014', artistId: 'ar_cj_chenier', date: '2026-05-02', start: '13:00', end: '14:15', stage: 'st_blues' },
  { id: 'pf_20260502_015', artistId: 'ar_delfeayo', date: '2026-05-02', start: '14:00', end: '15:30', stage: 'st_jazz' },

  // —— Sun May 3 ——
  { id: 'pf_20260503_001', artistId: 'ar_ewf', date: '2026-05-03', start: '18:15', end: '20:00', stage: 'st_acura' },
  { id: 'pf_20260503_002', artistId: 'ar_trombone_shorty', date: '2026-05-03', start: '19:00', end: '20:30', stage: 'st_gentilly' },
  { id: 'pf_20260503_003', artistId: 'ar_teddy_swims', date: '2026-05-03', start: '17:00', end: '18:30', stage: 'st_acura' },
  { id: 'pf_20260503_004', artistId: 'ar_tedeschi_trucks', date: '2026-05-03', start: '15:00', end: '16:45', stage: 'st_gentilly' },
  { id: 'pf_20260503_005', artistId: 'ar_herbie', date: '2026-05-03', start: '16:30', end: '18:00', stage: 'st_jazz' },
  { id: 'pf_20260503_006', artistId: 'ar_mavis', date: '2026-05-03', start: '15:00', end: '16:15', stage: 'st_blues' },
  { id: 'pf_20260503_007', artistId: 'ar_galactic', date: '2026-05-03', start: '17:00', end: '18:30', stage: 'st_blues' },
  { id: 'pf_20260503_008', artistId: 'ar_rebirth', date: '2026-05-03', start: '16:00', end: '17:15', stage: 'st_fais' },
  { id: 'pf_20260503_009', artistId: 'ar_radiators', date: '2026-05-03', start: '14:00', end: '15:30', stage: 'st_gentilly' },
  { id: 'pf_20260503_010', artistId: 'ar_jackie_venson', date: '2026-05-03', start: '13:00', end: '14:15', stage: 'st_blues' },
  { id: 'pf_20260503_011', artistId: 'ar_big_sam', date: '2026-05-03', start: '15:30', end: '16:45', stage: 'st_fais' },
  { id: 'pf_20260503_012', artistId: 'ar_george_porter', date: '2026-05-03', start: '14:00', end: '15:15', stage: 'st_jazz' },
];

export function buildPerformances(): Performance[] {
  return R.map((row) => {
    const m = STAGE_META[row.stage];
    return {
      id: row.id,
      artistId: row.artistId,
      date: row.date,
      startTime: row.start,
      endTime: row.end,
      stageId: row.stage,
      stageName: m.stageName,
      mapZoneId: m.mapZoneId,
    };
  });
}
