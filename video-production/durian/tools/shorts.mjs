// Plans the vertical shorts: global start/end in the master render + per-word caption timings.
import {buildSync} from 'esbuild';
import fs from 'node:fs';
const out = new URL('./.sh-bundle.mjs', import.meta.url).pathname;
buildSync({stdin: {contents: "export {buildTimeline} from './timeline';", resolveDir: new URL('../src', import.meta.url).pathname, loader: 'ts'}, bundle: true, format: 'esm', platform: 'node', outfile: out});
const {buildTimeline} = await import(out);
fs.unlinkSync(out);
const W = JSON.parse(fs.readFileSync(new URL('./words.json', import.meta.url)));
const T = JSON.parse(fs.readFileSync(new URL('../src/timings.json', import.meta.url)));
const {segs} = buildTimeline();
const SHORTS = [
  {id: 's1', ch: '00-cold-open', from: 1, to: 10, hook: ['China buys', '90%', 'of all durian exports']},
  {id: 's2', ch: '02-gold-rush', from: 2, to: 10, hook: ["Vietnam's", '$4 billion', 'durian gold rush']},
  {id: 's3', ch: '03-durian-express', from: 1, to: 8, hook: ['How China gets durians', 'in 26 hours', '']},
  {id: 's4', ch: '04-yellow-scandal', from: 1, to: 6, hook: ['The', 'yellow dye', 'scandal']},
];
const plan = SHORTS.map((s, n) => {
  const seg = segs.find((g) => g.kind === 'chapter' && g.id === s.ch);
  const off = seg.from / 30;
  const t = T.find((c) => c.id === s.ch);
  const words = W[s.ch];
  const paras = fs.readFileSync(new URL(`../narration/${s.ch}.txt`, import.meta.url), 'utf8').split('\n\n').map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const firstIdx = t.paras.map((p, k) => (k === 0 ? 0 : words.findIndex(([, x]) => x >= p.start + 0.1)));
  const start = Math.max(0, off + (s.from === 1 ? 0 : t.paras[s.from - 1].start) - 0.1);
  const end = s.to < t.paras.length ? off + t.paras[s.to].start - 0.2 : (seg.from + seg.dur) / 30 - 0.3;
  const cap = [];
  for (let k = s.from - 1; k < s.to; k++) {
    const pw = words.slice(firstIdx[k], k + 1 < paras.length ? firstIdx[k + 1] : words.length);
    const disp = paras[k].split(' ');
    const r = pw.length / disp.length;
    disp.forEach((w, i) => cap.push([w, +(off + pw[Math.min(pw.length - 1, Math.floor(i * r))][1] - start).toFixed(2)]));
  }
  return {...s, part: n + 1, of: SHORTS.length, start: +start.toFixed(2), end: +end.toFixed(2), dur: +(end - start).toFixed(2), words: cap};
});
fs.mkdirSync(new URL('../public/shorts', import.meta.url), {recursive: true});
fs.writeFileSync(new URL('../src/shorts.json', import.meta.url), JSON.stringify(plan));
plan.forEach((p) => console.log(p.id, p.ch, p.start, p.end, 'dur', p.dur, 'words', p.words.length));
