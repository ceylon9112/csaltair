/**
 * One-off: fetches Wikipedia REST summary thumbnails for artist page titles.
 * Run: node scripts/fetch-artist-wikipedia-images.mjs
 * Requires network. Outputs JSON lines: id, title, thumbnail, error
 */
const titles = [
  ['ar_kings_leon', 'Kings of Leon'],
  ['ar_raye', 'Raye (singer)'],
  ['ar_stephen_marley', 'Stephen Marley'],
  ['ar_preservation', 'Preservation Hall Jazz Band'],
  ['ar_blind_boys', 'The Blind Boys of Alabama'],
  ['ar_cowboy_mouth', 'Cowboy Mouth'],
  ['ar_charlie_musselwhite', 'Charlie Musselwhite'],
  ['ar_cimafunk', 'Cimafunk'],
  ['ar_nicholas_payton', 'Nicholas Payton'],
  ['ar_donald_harrison', 'Donald Harrison'],
  ['ar_kenny_neal', 'Kenny Neal'],
  ['ar_brass_a_holics', 'Brass-A-Holics'],
  ['ar_shinyribs', 'Shinyribs'],
  ['ar_jon_batiste', 'Jon Batiste'],
  ['ar_lorde', 'Lorde'],
  ['ar_sean_paul', 'Sean Paul'],
  ['ar_big_freedia', 'Big Freedia'],
  ['ar_ani', 'Ani DiFranco'],
  ['ar_cyril_neville', 'Cyril Neville'],
  ['ar_lil_ed', "Lil' Ed and the Blues Imperials"],
  ['ar_dozen_brass', 'The Dirty Dozen Brass Band'],
  ['ar_stevie_nicks', 'Stevie Nicks'],
  ['ar_tyler_childers', 'Tyler Childers'],
  ['ar_nas', 'Nas'],
  ['ar_jason_isbell', 'Jason Isbell'],
  ['ar_rhiannon', 'Rhiannon Giddens'],
  ['ar_revivalists', 'The Revivalists'],
  ['ar_bruce_hornsby', 'Bruce Hornsby'],
  ['ar_burning_spear', 'Burning Spear'],
  ['ar_samantha_fish', 'Samantha Fish'],
  ['ar_kermit', 'Kermit Ruffins'],
  ['ar_sonny_landreth', 'Sonny Landreth'],
  ['ar_dwayne_dopsie', 'Dwayne Dopsie'],
  ['ar_rod_stewart', 'Rod Stewart'],
  ['ar_david_byrne', 'David Byrne'],
  ['ar_st_vincent', 'St. Vincent (musician)'],
  ['ar_irma', 'Irma Thomas'],
  ['ar_widespread_panic', 'Widespread Panic'],
  ['ar_lake_street', 'Lake Street Dive'],
  ['ar_lettuce', 'Lettuce (band)'],
  ['ar_leela_james', 'Leela James'],
  ['ar_alejandro', 'Alejandro Escovedo'],
  ['ar_lainey_wilson', 'Lainey Wilson'],
  ['ar_black_keys', 'The Black Keys'],
  ['ar_ziggy', 'Ziggy Marley'],
  ['ar_rickie_lee', 'Rickie Lee Jones'],
  ['ar_eagles', 'Eagles (band)'],
  ['ar_alabama_shakes', 'Alabama Shakes'],
  ['ar_tpain', 'T-Pain'],
  ['ar_dianne_reeves', 'Dianne Reeves'],
  ['ar_dumpstaphunk', 'Dumpstaphunk'],
  ['ar_little_feat', 'Little Feat'],
  ['ar_sierra_hull', 'Sierra Hull'],
  ['ar_soul_rebels', 'The Soul Rebels'],
  ['ar_anders_osborne', 'Anders Osborne'],
  ['ar_irma_gospel', 'Irma Thomas'],
  ['ar_corey_henry', 'Corey Henry'],
  ['ar_leo_nocentelli', 'Leo Nocentelli'],
  ['ar_cj_chenier', 'C. J. Chenier'],
  ['ar_delfeayo', 'Delfeayo Marsalis'],
  ['ar_teddy_swims', 'Teddy Swims'],
  ['ar_ewf', 'Earth, Wind & Fire'],
  ['ar_tedeschi_trucks', 'Tedeschi Trucks Band'],
  ['ar_herbie', 'Herbie Hancock'],
  ['ar_trombone_shorty', 'Trombone Shorty'],
  ['ar_mavis', 'Mavis Staples'],
  ['ar_galactic', 'Galactic'],
  ['ar_radiators', 'The Radiators (American band)'],
  ['ar_rebirth', 'Rebirth Brass Band'],
  ['ar_jackie_venson', 'Jackie Venson'],
  ['ar_big_sam', "Big Sam's Funky Nation"],
  ['ar_george_porter', 'George Porter Jr.'],
  ['ar_tab_benoit', 'Tab Benoit'],
  ['ar_terence_blanchard', 'Terence Blanchard'],
  ['ar_shemekia', 'Shemekia Copeland'],
  ['ar_cassandra', 'Cassandra Wilson'],
];

async function fetchSummary(title) {
  const enc = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'JazzFest2026App/1.0 (educational)' } });
  if (!res.ok) return { error: `${res.status}` };
  const j = await res.json();
  return {
    title: j.title,
    thumbnail: j.thumbnail?.source ?? null,
    description: j.description,
  };
}

const out = [];
for (const [id, title] of titles) {
  try {
    const r = await fetchSummary(title);
    out.push({ id, wikiTitle: title, ...r });
    console.log(id, r.thumbnail ? 'OK' : 'NO_IMG', r.error ?? '');
  } catch (e) {
    out.push({ id, wikiTitle: title, error: String(e) });
    console.log(id, 'ERR', e.message);
  }
  await new Promise((r) => setTimeout(r, 150));
}

console.log('\n--- JSON ---\n');
console.log(JSON.stringify(out, null, 2));
