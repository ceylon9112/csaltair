const u =
  'https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srsearch=' +
  encodeURIComponent('Radiators New Orleans band') +
  '&srnamespace=6&srlimit=15';
const d = await fetch(u).then((r) => r.json());
d.query?.search?.forEach((s) => console.log(s.title));
