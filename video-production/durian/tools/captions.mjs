// Writes captions.srt from the narration text, word timings (tools/words.json) and the video timeline.
import {buildSync} from 'esbuild';
import fs from 'node:fs';
const out = new URL('./.cap-bundle.mjs', import.meta.url).pathname;
buildSync({stdin: {contents: "export {buildTimeline} from './timeline';", resolveDir: new URL('../src', import.meta.url).pathname, loader: 'ts'}, bundle: true, format: 'esm', platform: 'node', outfile: out});
const {buildTimeline} = await import(out);
fs.unlinkSync(out);
const W = JSON.parse(fs.readFileSync(new URL('./words.json', import.meta.url)));
const {segs} = buildTimeline();
const norm = (w) => w.toLowerCase().replace(/[^a-z0-9']/g, '');
const ts = (s) => { const ms = Math.round(s * 1000); const h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, sec = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
const cues = [];
for (const s of segs) {
  if (s.kind !== 'chapter') continue;
  const off = s.from / 30;
  const T = JSON.parse(fs.readFileSync(new URL('../src/timings.json', import.meta.url))).find((c) => c.id === s.id);
  const words = W[s.id];
  const paras = fs.readFileSync(new URL(`../narration/${s.id}.txt`, import.meta.url), 'utf8').split('\n\n').map((p) => p.replace(/\s+/g, ' ').trim()).filter(Boolean);
  // Word index where each paragraph starts (first aligned word at/after the paragraph start time).
  const firstIdx = T.paras.map((p, k) => (k === 0 ? 0 : words.findIndex(([, t]) => t >= p.start + 0.1)));
  paras.forEach((ptext, k) => {
    const w0 = firstIdx[k], w1 = k + 1 < paras.length ? firstIdx[k + 1] : words.length;
    const pw = words.slice(w0, w1);
    const disp = ptext.split(' ');
    const ratio = pw.length / disp.length;
    const pend = k + 1 < paras.length ? T.paras[k + 1].start : s.dur / 30;
    let cur = [], start = 0;
    disp.forEach((w, i) => {
      if (!cur.length) start = i;
      cur.push(w);
      const line = cur.join(' ');
      if (/[.?!:]["”]?$/.test(w) || line.length > 38 || i === disp.length - 1) {
        const a = pw[Math.min(pw.length - 1, Math.floor(start * ratio))][1];
        const bi = Math.floor((i + 1) * ratio);
        const b = bi < pw.length ? pw[bi][1] - 0.05 : Math.min(pend, (pw[pw.length - 1][1] + 0.9));
        cues.push([off + a, off + Math.max(a + 0.8, b), line]);
        cur = [];
      }
    });
  });
}
fs.writeFileSync(new URL('../captions.srt', import.meta.url), cues.map(([a, b, t], i) => `${i + 1}\n${ts(a)} --> ${ts(b)}\n${t}\n`).join('\n'));
console.log('cues', cues.length);
