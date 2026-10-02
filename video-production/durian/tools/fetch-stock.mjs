// Downloads real stock footage for every B-roll slot that doesn't have a file yet.
//
//   PEXELS_API_KEY=xxxx node tools/fetch-stock.mjs          # all missing shots
//   PEXELS_API_KEY=xxxx node tools/fetch-stock.mjs durian-slowmo coffee-cherries
//
// Free key: https://www.pexels.com/api/ (Pexels licence: free commercial use, no
// attribution required). Optional PIXABAY_API_KEY adds Pixabay as a fallback.
// Files land in public/broll/<id>.mp4 and are logged to public/broll/CREDITS.md.
import fs from 'node:fs';
import {buildSync} from 'esbuild';

const root = new URL('../', import.meta.url);
const bundle = new URL('./.fetch-bundle.mjs', import.meta.url).pathname;
buildSync({stdin: {contents: "export {SHOTS} from './shots';", resolveDir: new URL('../src', import.meta.url).pathname, loader: 'ts'}, bundle: true, format: 'esm', platform: 'node', outfile: bundle});
const {SHOTS} = await import(bundle);
fs.unlinkSync(bundle);

const PEXELS = process.env.PEXELS_API_KEY;
const PIXABAY = process.env.PIXABAY_API_KEY;
if (!PEXELS && !PIXABAY) {
  console.error('Set PEXELS_API_KEY (free at https://www.pexels.com/api/) and/or PIXABAY_API_KEY.');
  process.exit(1);
}
const dir = new URL('public/broll/', root);
const have = new Set(fs.readdirSync(dir).map((f) => f.replace(/\.[^.]+$/, '')));
const only = process.argv.slice(2);
const credits = [];

// Prefer landscape HD (~1920 wide), 6–40 s long.
const pickPexels = (videos) => {
  for (const v of videos) {
    if (v.width < v.height || v.duration < 6) continue;
    const f = v.video_files.filter((x) => x.width >= 1280 && x.width <= 2560 && x.file_type === 'video/mp4').sort((a, b) => Math.abs(a.width - 1920) - Math.abs(b.width - 1920))[0];
    if (f) return {url: f.link, credit: `${v.user?.name ?? 'Unknown'} via Pexels: ${v.url}`};
  }
};
const pickPixabay = (hits) => {
  for (const h of hits) {
    const f = h.videos?.large?.url ? h.videos.large : h.videos?.medium;
    if (f?.url && h.duration >= 6) return {url: f.url, credit: `${h.user} via Pixabay: ${h.pageURL}`};
  }
};

for (const [id, shot] of Object.entries(SHOTS)) {
  if (shot.kind === 'ai' || have.has(id) || (only.length && !only.includes(id))) continue;
  const q = shot.query;
  let hit;
  try {
    if (PEXELS) {
      const r = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=15&orientation=landscape`, {headers: {Authorization: PEXELS}});
      if (r.ok) hit = pickPexels((await r.json()).videos ?? []);
    }
    if (!hit && PIXABAY) {
      const r = await fetch(`https://pixabay.com/api/videos/?key=${PIXABAY}&q=${encodeURIComponent(q)}&per_page=15`);
      if (r.ok) hit = pickPixabay((await r.json()).hits ?? []);
    }
  } catch (e) {
    console.log(`✗ ${id}: ${e.message}`);
    continue;
  }
  if (!hit) {
    console.log(`– ${id}: nothing found for "${q}"`);
    continue;
  }
  const res = await fetch(hit.url);
  fs.writeFileSync(new URL(`${id}.mp4`, dir), Buffer.from(await res.arrayBuffer()));
  credits.push(`- ${id}: ${hit.credit}`);
  console.log(`✓ ${id}  ←  ${hit.credit}`);
}
if (credits.length) fs.appendFileSync(new URL('CREDITS.md', dir), credits.join('\n') + '\n');
console.log('Done. Watch each clip before publishing: search results can be off-topic.');
