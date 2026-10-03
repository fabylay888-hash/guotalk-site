// Lists which b-roll file each beat actually shows (first available id), and flags repeats.
import {buildSync} from 'esbuild';
import fs from 'node:fs';
const out = new URL('./.usage-bundle.mjs', import.meta.url).pathname;
buildSync({stdin: {contents: "export {SCENES} from './scenes'; export {MAPS} from './maps';", resolveDir: new URL('../src', import.meta.url).pathname, loader: 'ts'}, bundle: true, format: 'esm', platform: 'node', outfile: out});
const {SCENES} = await import(out);
fs.unlinkSync(out);
const avail = JSON.parse(fs.readFileSync(new URL('../src/available.json', import.meta.url)));
const pick = (ids) => (ids || []).find((i) => avail[i]);
const uses = {};
const add = (id, where) => { if (id) (uses[id] ||= []).push(where); };
const walk = (o, where) => {
  if (!o) return;
  if (o.type === 'seq') return o.parts.forEach((p, k) => walk(p, `${where}.${k}`));
  if (o.ids) add(pick(o.ids), where);
  if (o.bg) add(pick(o.bg), where);
  if (o.left) add(pick(o.left.ids), where + 'L');
  if (o.right) add(pick(o.right.ids), where + 'R');
  if (o.clips) add(pick(o.clips), where);
  if (o.cards) o.cards.forEach((c) => c.img && add(pick(c.img), `${where}:${c.key}`));
};
for (const [ch, beats] of Object.entries(SCENES)) beats.forEach((b, i) => {
  const w = `${ch.slice(0, 2)}¶${i + 1}`;
  if (b.broll) add(pick(b.broll), w);
  walk(b.overlay, w);
});
for (const [id, w] of Object.entries(uses).sort((a, b) => b[1].length - a[1].length)) console.log(`${w.length > 1 ? '!!' : '  '} ${w.length}× ${id.padEnd(24)} ${w.join(', ')}`);
