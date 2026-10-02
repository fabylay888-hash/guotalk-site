// Writes src/available.json: {shotId: filename} for every file in public/broll/.
import fs from 'node:fs';
const dir = new URL('../public/broll/', import.meta.url);
fs.mkdirSync(dir, {recursive: true});
const map = {};
for (const f of fs.readdirSync(dir)) {
  const m = f.match(/^(.+)\.(mp4|mov|webm|m4v|jpg|jpeg|png|webp)$/i);
  if (m && !map[m[1]]) map[m[1]] = f;
}
fs.writeFileSync(new URL('../src/available.json', import.meta.url), JSON.stringify(map, null, 1));
console.log(`b-roll found: ${Object.keys(map).length}`);
