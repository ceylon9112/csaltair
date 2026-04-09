const titles = [
  'Brass-A-Holics',
  'Brass band',
  "Lil' Ed Williams",
  'Lil Ed and the Blues Imperials',
  'Dumpstaphunk',
  'Galactic (band)',
  'The Radiators (Louisiana band)',
  'Radiators (American band)',
];

async function f(title) {
  const enc = encodeURIComponent(title.replace(/ /g, '_'));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${enc}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'JazzFest2026App/1.0' } });
  const j = res.ok ? await res.json() : null;
  console.log(title, res.status, j?.thumbnail?.source ?? 'no-thumb', j?.title);
}

for (const t of titles) {
  await f(t);
  await new Promise((r) => setTimeout(r, 120));
}
