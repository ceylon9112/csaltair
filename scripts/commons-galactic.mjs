const qs = new URLSearchParams({
  action: 'query',
  format: 'json',
  titles: "File:Galactic at Tipitina's 2009.jpg",
  prop: 'imageinfo',
  iiprop: 'url',
  iiurlwidth: '500',
});
const url = 'https://commons.wikimedia.org/w/api.php?' + qs;
const d = await fetch(url).then((r) => r.json());
console.log(JSON.stringify(d, null, 2));
