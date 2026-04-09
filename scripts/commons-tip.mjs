const qs = new URLSearchParams({
  action: 'query',
  format: 'json',
  titles: "File:Napoleon Avenue, Uptown New Orleans 27 June 2022- Tipitina's.jpg",
  prop: 'imageinfo',
  iiprop: 'url',
  iiurlwidth: '500',
});
const d = await fetch('https://commons.wikimedia.org/w/api.php?' + qs).then((r) => r.json());
console.log(JSON.stringify(d, null, 2));
