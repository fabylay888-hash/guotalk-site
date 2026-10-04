# GuoTalk video production — handoff for the next video

Read this whole file before doing anything. It describes how the first GuoTalk documentary
("China Buys 90% of the World's Durian Exports", published at
https://www.youtube.com/watch?v=7bfKSKMBpTg) was made, every tool and setting used, and the
rules the creator set along the way. The next video should be made the same way.

Next video (already teased in the durian video's ending and end card): **Datang, the town in
Zhuji, Zhejiang, that makes about a third of the world's socks.**

---

## 0. Where everything is

- Repo: `fabylay888-hash/guotalk-site`
- **All the work lives on branch `claude/guotalk-video-script-f1rn60`** (not merged to main at the
  time of writing). A new session starts on its own branch, so first run:
  ```
  git fetch origin claude/guotalk-video-script-f1rn60
  git checkout origin/claude/guotalk-video-script-f1rn60 -- video-production
  ```
  (or ask the creator whether they want that branch merged into main first).
- Project: `video-production/durian/` — Remotion project. **Copy it as the template** for the new
  video (e.g. `video-production/socks/`), keep the components and tools, replace narration,
  scenes, maps, b-roll, music.
- `out/` and `node_modules/` are gitignored. Renders are not in git. Big source cuts
  (`public/shorts/s*.mp4`) are gitignored too.
- Key docs inside `video-production/durian/`:
  `SCRIPT_REVIEW.md`, `SHOT_LIST.md`, `DESCRIPTION.md`, `YOUTUBE_PACKAGE.md`, `captions.srt`,
  `sources/Durian_Footage_Sourcebook.xlsx`, `thumbnails/`.

## 1. The creator and how to work with them

- Channel: **GuoTalk**. Explainer documentaries about China and trade, in the
  **Johnny Harris style**: paper-texture maps, hand-drawn notes, investigation boards,
  real footage, big numbers, motion graphics.
- The creator is **not technical** and works on **Windows** (desktop folder
  `C:\Users\ualik\Desktop\...`). Give plain-language, numbered steps for anything they do
  themselves (downloads, renaming files, YouTube Studio). Explain terms (captions, end screen).
- They want: concise answers, structure, honest critique, and to be told *why*.
  They push back on anything repetitive or that looks cheap.
- **Workflow they asked for: build and review clip by clip** (cold open, then chapter 1, chapter 2…),
  not the whole video at once. Render only that chapter's frame range, send a preview, take
  feedback, then move on. Full render only at the end.
- They download stock footage themselves (the sandbox can't reach Pexels/Pixabay/Wikimedia —
  see §7) and attach it in chat. For each clip, give them a numbered list:
  file name to save as, what it shows, the download link, licence/credit.

## 2. Pipeline (in order)

1. **Script review.** Read the script, flag unverified claims, missing sources, weak lines
   (`SCRIPT_REVIEW.md`). Ask the creator for sources or soften wording. Accuracy matters:
   e.g. "90% of durian **exports**", not "90% of durians".
2. **Footage sourcebook.** Minute-by-minute shot list with free/CC sources and links
   (`SHOT_LIST.md`, `sources/*.xlsx`). Prefer real stock/archival; AI images only as fallback.
   Note licence + credit for every CC image.
3. **Voiceover** (ElevenLabs, §3). Narration lives in `narration/*.txt`, one file per chapter,
   paragraphs separated by blank lines. **Record all chapters in one pass with identical
   settings** (see §3 — the creator noticed tone drift when chapters were done separately).
4. **Forced alignment**: `python3 tools/align.py` → `src/timings.json` (paragraph starts) and
   `tools/words.json` (word timings). Re-run after any VO change.
5. **Scenes**: `src/scenes.ts` — one Beat per paragraph (b-roll ids + an overlay device).
   Use `tools/anchor.py <chapter> <para> "<phrase>"` to get exact fractions / frame offsets for
   moments inside a paragraph (seq splits, counters, reveals). Never guess timings.
6. **Clip-by-clip review** (render chapter frame range, send preview, iterate).
7. **Uniqueness audit**: `node tools/usage.mjs` — every picture/clip must appear **once**
   (recap boards excepted). The creator explicitly asked for this.
8. **Chapter-card backgrounds**: one original generated image per chapter (`public/chapters/bg-0N.jpg`).
9. **Music + SFX** (§3), mixed under the voice.
10. **Full render**, then delivery file (§6).
11. **YouTube package**: titles (3 for A/B), description with timestamps + sources + credits +
    AI disclosure, tags, pinned comment, captions (`node tools/captions.mjs` → `captions.srt`),
    3 thumbnails (`Thumb` composition), end screen instructions.
12. **Shorts** for YouTube Shorts / TikTok / Reels (`Short-*` compositions, §5) + per-platform
    captions/hashtags.

## 3. Tools and exact settings

### Remotion (rendering)
- Remotion **4.0.532** (React/TS). Fonts are local woff2 in `public/fonts` (Fraunces, Inter,
  Noto Sans SC subset, Permanent Marker, Caveat, Special Elite).
- Render with the preinstalled headless shell:
  ```
  npx remotion render src/index.ts DurianVideo out/x.mp4 \
    --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
    --frames=A-B --log=error
  ```
  Stills: `npx remotion still ... --frame=N --scale=0.4`. Check stills before every render.
- Compositions: `DurianVideo` (1920×1080, 30 fps), `Thumb` (props `{v:'A'|'B'|'C'}`),
  `Short-s1..s4` (1080×1920).
- Maps: d3-geo + topojson-client + world-atlas `countries-50m.json` (`src/components/MapScene.tsx`,
  presets in `src/maps.ts`). There is already a `zhuji` preset (China dim, pin on Datang).

### ElevenLabs MCP (voice, images, music, SFX)
- Use one flow for everything: **flow `1tXAJgZ5gHQ3f1gxUcy2`**.
- **Voice**: Jerry B. — **`J9NvviOEdVm6E7Hwdpdj`**, model **`eleven_v3`**, one generation per
  chapter, prompt = the chapter text with **a single tag at the very start: `[engaged storyteller]`**
  and no other tags. (Per-paragraph emotion tags made each chapter sound like a different person.)
  Then normalise: `ffmpeg -i in.mp3 -af loudnorm=I=-16.5:TP=-1.5:LRA=11 -ar 44100 -b:a 192k public/vo/<id>.mp3`.
- **Images**: `gpt-image-2.5-flare`, `generations_count: 1` (2 when choosing), 16:9, prompts say
  "documentary photograph … no text". Background removal: `birefnet-v2-bg-removal` with
  `connect_from` the image node id.
- **Music**: `creative_generate_in_flow` node_type `music`, model **`eleven_music_v2_5`**, one cue
  per chapter (mood per chapter, "instrumental, no vocals, about N seconds" a bit longer than the
  chapter). Normalise each to −18 LUFS (`loudnorm=I=-18`), files `public/music/<chapter-id>.mp3`.
  In `Video.tsx` each cue starts at the chapter card and fades out at chapter end;
  `MUSIC_VOL = 0.16`. The creator approved this level.
- **SFX**: node_type `sfx`, model `eleven_text_to_sound_v2`. Library in `public/sfx/`:
  `chapter` (paper rip + boom on chapter cards), `whoosh` (whip cuts), `burn` (film burn),
  `stamp`, `flap` (departure board), `receipt`, `pop` (tags/stats), `riser` (title, map dives).
  Auto-cued from overlay types in `Video.tsx` (`cuesFor`).
- Results come back as signed `storage.googleapis.com` URLs (**expire after ~2 h**) — download
  with `curl -sS -o file "<master_url>"` right away. Poll with `creative_get_flow_run_status`.

### Other tools
- **pocketsphinx** forced alignment (`tools/align.py`, `tools/norm.py` spells numbers; add
  out-of-dictionary words to `EXTRA` with ARPAbet, e.g. `'datang': 'D AA T AA NG'`).
- **ffmpeg** for everything else (transcode, crop vertical stock, loudness, contact sheets).
  **Always pass `-nostdin` inside `while read` loops** (otherwise ffmpeg eats the loop input).
- **WebSearch** works for fact-checking sources (used to verify the socks claim).
- **vidIQ** MCP exists (the creator also uses the vidIQ browser extension for thumbnail scores).

## 4. Visual system (reuse, but don't repeat)

Overlay devices in `src/components/Devices.tsx` / `Overlays.tsx`, chosen per beat in `scenes.ts`:
stat, statover (stat over footage), bars, quote, note, callout, route, timeline, price, tag
(price tag), stamp, location, map (+ tilt 3D, movers 🚆🚢, arrows, pins, notes, header),
mapdive, scribbles, grid (100 icons), growth (tower ×12), receipt, clock (shrink), depart
(split-flap board), phone (TikTok-style feed), board (investigation board with strings),
doc (form + stamp), split (two-sided), tonnage (two trains, counter), homegrown (durian flies out
of grid + expert card), timing (price curve + trees growing), appetite (bowl + odometer), seq
(several devices inside one paragraph).
Transitions: crossfade, whip, film burn, paper-tear chapter cards (with photo backgrounds).
Paper texture + film grain throughout.

**For the socks video, build new devices** — the creator said "don't use the same motion
graphics as before, create something new and creative". Reuse the infrastructure (maps, paper,
captions, cards), not the same signature animations.

## 5. Rules the creator set (follow all of them)

1. **No placeholder text, no "AI illustration" labels on screen.** (Disclose AI in the
   YouTube description and platform AI toggles instead.)
2. **Every image/clip used once.** Run `tools/usage.mjs`. Recap boards may reuse thumbnails.
3. **Don't repeat motion graphics**; each new graphic should be new and creative.
4. **Real place names**, not vague regions (e.g. "Đắk Lắk", not "Central Highlands").
5. **Start the video on a map** with the country named at the top, transitioning smoothly.
6. **No dead space**: if a frame is half empty (like the first homegrown grid), fill it with
   the narration's next beats.
7. **Reject misleading footage** and tell the creator why (e.g. orange orchards or golf courses
   for durian; a US packing house for durian packing). Generic is OK only when clearly generic.
8. **Accuracy**: exact numbers with sources; "reportedly" where the source says so; paraphrases
   are not shown in quotation marks. Thumbnail text must be accurate too.
9. **One consistent voiceover pass** (§3).
10. **Chapter cards** have original background images; end card teases the next video with an
    image (empty right side kept for YouTube end-screen elements).
11. The creator likes: maps with country headers, motion design for big numbers, the departure
    board, the train tonnage, the bowl/odometer, investigation boards, real footage with
    stats over it, music per chapter, SFX on cards and transitions.

## 6. Delivery (sandbox limits — important)

- **Files sent in chat are limited to 30 MiB each** (any type, zips too).
  - Chapter previews: 960–1280 px wide, `-crf 30–35`, under 30 MB.
  - Final 1080p (~450 MB): two-pass encode to ~6.3 Mbps, then **split into 29 MB pieces**:
    `split -b 29M -d -a 3 --numeric-suffixes=1 final.mp4 final.mp4.` and send all pieces.
    The creator joins them on Windows with (in the folder, after `cd /d "%USERPROFILE%\Desktop\<folder>"`):
    `copy /b name.mp4.001+name.mp4.002+...+name.mp4.0NN name.mp4`
    Give them the exact full command and the expected byte size to check.
  - Shorts: two-pass to 27.5 MB each.
- Don't use `pkill -f <pattern>` where the pattern also appears in your own command line (it
  kills its own shell). Don't use `rm -f *`-style deletions (blocked by safety check).

## 7. Environment gotchas

- **Blocked hosts**: Pexels, Pixabay, Wikimedia, skillry.dev. Don't try relays. The creator
  downloads stock and attaches it; files land in
  `/root/.claude/uploads/<session>/` (videos) or `/tmp/claude-0/.../images/N.jpg` (images).
- Images pasted inline in chat sometimes don't reach disk — ask the creator to re-attach as a file.
- Vertical stock: crop to 16:9 (`crop=...`) or blurred-backdrop pillarbox for time-lapses.
- Some stock has stabilisation seams on an edge — crop them.
- Google Fonts are blocked by the proxy CA → fonts are local.
- `skillry-cli` install was denied by the safety classifier; don't retry.

## 8. Commit hygiene

- Commit and push after every meaningful step to the session's branch. Footer:
  ```
  Co-Authored-By: <model attribution line from the session reminder>
  Claude-Session: <session link>
  ```
- Never put model names in commits. Keep `out/` out of git.

## 9. Durian video — final facts (for reference)

- Length 9:43 (incl. 12 s end card). 8 parts: Cold open, King of Fruits, Gold Rush,
  Durian Express, Yellow Scandal, Glut, Twist (Hainan), Close.
- Timestamps: 0:00 / 1:05 / 2:18 / 3:57 / 5:14 / 6:41 / 7:55 / 8:41.
- Title used: "China Buys 90% of the World's Durians. That's a Problem." A/B test with
  "The $7.5 Billion Fruit That Depends on One Buyer" and "Southeast Asia Bet Everything on
  One Customer"; thumbnails A (glowing China on black + durian + "90% of durian exports"),
  B (excited buyer with open durian, "$7.5B on one fruit"), C (worried farmer, crash arrow,
  "ONE BUYER"). vidIQ scored C highest (faces + emotion score well).
- 4 Shorts made (1:07, 1:33, 1:20, 1:31): hook headline on top, 16:9 video in the middle,
  word-by-word yellow captions, 6 s end card with narrator line "Want the full story? The full
  documentary is on my YouTube channel, GuoTalk. Link in bio." Post one per day; set YouTube
  Shorts "Related video" to the full video.
- CC credits used: China–Laos Railway (Dominik Landwehr, CC BY-SA 4.0), Musang King
  (Rruunnaa, CC BY 4.0), Haitang Bay (Charlie fong, CC BY-SA 4.0), Hữu Nghị Quan (Liftold,
  CC BY-SA 3.0).

## 10. Next video: socks town (Datang)

- Claim already sourced: Datang makes ~25 billion pairs a year, ~70% of China's output and about
  a third of the world's —
  China Daily (30 Jun 2022) https://www.chinadaily.com.cn/a/202206/30/WS62bcf3aaa310fd2b29e696ac.html
  and Global Times (2023) https://www.globaltimes.cn/page/202305/1291416.shtml
- Map preset `zhuji` exists (pin "Datang, Zhejiang"). End-card teaser image:
  `public/chapters/next-socks.jpg` (AI-generated).
- First steps for the new session: get the script from the creator → script review → sourcebook
  → voice (one pass) → align → build cold open → review clip by clip.
