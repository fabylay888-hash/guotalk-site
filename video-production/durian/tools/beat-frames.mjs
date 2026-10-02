// Prints the global frame where each beat starts (for spot-checking stills).
import fs from 'node:fs';
const T = JSON.parse(fs.readFileSync(new URL('../src/timings.json', import.meta.url)));
const FPS = 30, f = (s) => Math.round(s * FPS);
let t = 0;
T.forEach((ch, i) => {
  if (i > 0) t += f(2.5);
  ch.paras.forEach((p, j) => console.log(`${t + f(p.start)}\t${ch.id}\t¶${j + 1}`));
  t += f(ch.duration + 0.6);
  if (i === 0) t += f(4.5);
});
console.log(`${t}\tend-card`);
