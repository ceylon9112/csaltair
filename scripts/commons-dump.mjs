const qs = new URLSearchParams({
  action: 'query',
  format: 'json',
  titles: 'File:Guitare en Scène 2017 (35940171461).jpg',
  prop: 'imageinfo',
  iiprop: 'url',
  iiurlwidth: '500',
});
const d = await fetch('https://commons.wikimedia.org/w/api.php?' + qs).then((r) => r.json());
console.log(JSON.stringify(d, null, 2));
