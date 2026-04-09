import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const text = fs.readFileSync(path.join(__dirname, '../data/seed/artistImages.ts'), 'utf8');
const re = /(ar_[a-z0-9_]+):\s*\n\s*'([^']+)'/g;
let m;
const pairs = [];
while ((m = re.exec(text)) !== null) {
  pairs.push([m[1], m[2]]);
}

for (const [id, url] of pairs) {
  try {
    const r = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'JazzFestVerify/1' } });
    console.log(r.ok ? 'OK' : 'FAIL', r.status, id);
    if (!r.ok) console.log('  ', url.slice(0, 90));
  } catch (e) {
    console.log('ERR', id, e.message);
  }
  await new Promise((r) => setTimeout(r, 50));
}
