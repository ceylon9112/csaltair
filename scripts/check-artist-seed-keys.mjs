import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../data/seed');

const reg = fs.readFileSync(path.join(root, 'artistRegistry.ts'), 'utf8');
const ids = [...reg.matchAll(/id: '(ar_[^']+)'/g)].map((m) => m[1]);

const img = fs.readFileSync(path.join(root, 'artistImages.ts'), 'utf8');
const imgKeys = [...img.matchAll(/(ar_[a-z0-9_]+):/g)].map((m) => m[1]);

const genre = fs.readFileSync(path.join(root, 'artistGenres.ts'), 'utf8');
const genreKeys = [...genre.matchAll(/(ar_[a-z0-9_]+):/g)].map((m) => m[1]);

const set = (a) => new Set(a);
const regS = set(ids);
const imgS = set(imgKeys);
const genS = set(genreKeys);

for (const id of regS) {
  if (!imgS.has(id)) console.error('missing image', id);
  if (!genS.has(id)) console.error('missing genre', id);
}
for (const id of imgS) {
  if (!regS.has(id)) console.error('extra image', id);
}
for (const id of genS) {
  if (!regS.has(id)) console.error('extra genre', id);
}
console.log('registry', regS.size, 'images', imgS.size, 'genres', genS.size);
