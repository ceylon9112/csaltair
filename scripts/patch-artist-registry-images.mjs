import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, '../data/seed/artistRegistry.ts');
let t = fs.readFileSync(p, 'utf8');

t = t.replace(
  /id: '(ar_[^']+)',\r?\n(    name:[^\r\n]+\r?\n)    imageUrl: IMG,/g,
  (_, id, nameLine) => {
    return `id: '${id}',\r\n${nameLine}    imageUrl: ARTIST_IMAGE_URL['${id}'],`;
  },
);

fs.writeFileSync(p, t);
console.log('patched', p);
