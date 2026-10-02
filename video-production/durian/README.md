# GuoTalk: "China Buys 90% of the World's Durian Exports" (Remotion project)

This folder is a complete video project in a Johnny Harris-style look: animated real-geography maps, paper textures, marker notes, highlighted research notes, film grain, and an expressive AI voiceover. Every footage beat has a named slot: drop a real clip in (or run `npm run fetch-stock`) and re-render.

| File | What it is |
|---|---|
| `SCRIPT_REVIEW.md` | Review of the script: unsourced claims, runtime, structure, risks |
| `SHOT_LIST.md` | Minute-by-minute shot list, plus a download checklist with links |
| `DESCRIPTION.md` | YouTube description draft: chapters, sources, credits |
| `narration/*.txt` | The narration, one file per chapter (one paragraph per beat) |
| `public/vo/*.mp3` | ElevenLabs voiceover (Jerry B., v3), one file per chapter |
| `narration/v3/*.txt` | The same narration with v3 delivery cues ([excited], [serious]…) |
| `src/maps.ts` | Animated map shots: camera moves, routes, arrows, marker notes |
| `public/broll/` | Your B-roll goes here (11 `ai-*.jpg` stand-ins are already in; real clips override them) |
| `src/scenes.ts` | Which visual and graphic goes on which paragraph |
| `src/shots.ts` | B-roll catalog: descriptions, search links, picked clips |

## 1. Install (once)

You need Node 18+ and ffmpeg.

```bash
cd video-production/durian
npm install
```

## 2. Add the stock footage

**Automatic (recommended):** get a free API key at https://www.pexels.com/api/, then run:

```bash
PEXELS_API_KEY=your_key npm run fetch-stock
```

This downloads a real clip for every empty slot and logs the credits to `public/broll/CREDITS.md`. Watch every clip before publishing: search results can be off-topic.

**Manual:**

1. Open `SHOT_LIST.md` → **Download checklist**.
2. For each shot, download a clip from the link, or search the site with the query given.
3. Save it as `public/broll/<shot-id>.mp4`, e.g. `public/broll/durian-slowmo.mp4`. Photos work too: `.jpg` or `.png` get a slow Ken Burns zoom.
4. Run `npm run shotlist` to tick off what's done.

A real clip always replaces the AI stand-in for that shot (`ai-*.jpg`). Beats with no footage at all use the map and paper graphics, so the video renders cleanly at any stage.

**Licences**
- **Pexels / Pixabay:** free for commercial use, attribution not required. Avoid clips with readable brand logos.
- **Wikimedia Commons:** check each file's licence on its page. CC BY / CC BY-SA require a credit, so add it to `DESCRIPTION.md`.
- **Never use** AFP, Reuters, Getty, Xinhua or other news photos and video without a licence, even if the article is the source of a fact.

## 3. Preview and render

```bash
npm run studio        # live preview in the browser (scrub, check timing)
npm run render        # final 1080p → out/durian.mp4
npm run render:draft  # fast half-resolution draft → out/durian-draft.mp4
```

## 4. Replace the voiceover (recommended: your own voice)

1. Record each chapter to match the text in `narration/NN-*.txt`, one take per file.
2. Export as `public/vo/NN-*.mp3`, using the same file names.
3. Run `npm run align`. This re-times every graphic to your reading, offline (`pip install pocketsphinx` first).
4. Render again.

If you edit the wording, edit `narration/*.txt` too. Keep one paragraph per beat. If you add or remove a paragraph, add or remove the matching entry in `src/scenes.ts`.

## 5. Music

Drop a track at `public/music.mp3` and uncomment the music line at the bottom of `src/Video.tsx`. Free options are the YouTube Audio Library and Pixabay Music.

## How it fits together

- `src/timings.json` holds each paragraph's start time. It comes from forced alignment of the VO (`tools/align.py`).
- `src/timeline.ts` lays out: cold open → title card → chapter card + chapter, ×7 → end card.
- `src/components/Overlays.tsx` has the graphics (stats, bar charts, quote, schematic supply map, routes, timeline, price drop, stamp), all in the GuoTalk palette.
