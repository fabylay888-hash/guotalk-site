# Script review: China Buys 90% of the World's Durian Exports

## Summary

The script is strong: it has a real character, one clear number and a rise-and-fall arc, and the fact-check has already removed the riskiest claims. Five things to fix before publishing:

1. **The runtime is about 10 minutes, not 11–12.** The narration is 1,237 words, not ~1,700. The voiceover runs 9:28, and with title and chapter cards the video is 10:07. The chapter timestamps in the script are wrong, so use the ones below.
2. **Six claims in the narration have no source in your fact-check table.** These are the ones commenters will check.
3. **There's little China in a China channel.** After Chapter 1, the story is told almost entirely from Southeast Asian farms.
4. **Lan has no picture.** The cold open is built around a man we never see, and stock footage of "a farmer" would imply it's him.
5. **The AI voiceover is a placeholder.** It's fine for timing and review. For the published video, see "AI voice and YouTube" below.

---

## 1. Runtime and chapters (from the real voiceover)

| Time | Section |
|---|---|
| 0:00 | Cold open |
| 1:05 | Title card |
| 1:10 | 1. The King of Fruits |
| 2:26 | 2. The Gold Rush |
| 4:06 | 3. The Durian Express |
| 5:27 | 4. The Yellow Scandal |
| 6:58 | 5. The Glut |
| 8:14 | 6. The Twist |
| 9:04 | Close |
| 9:55 | End screen (12 s) |

**Options:**
- **A. Ship at ~10 min (recommended).** It still clears the 8-minute mid-roll threshold, and tighter usually retains better.
- **B. Add 60–90 s.** This gets you to ~11 min. Spend it on the China angle in section 3, not on padding.

## 2. Claims that need a source before publishing

These lines are in the narration but not in your fact-check table:

| Line | Risk | Fix |
|---|---|---|
| "nearly twelve times what it spent a decade earlier" (cold open) | High. It's a specific multiplier in the hook. | Find the 2015 China durian import value (UN Comtrade / China Customs). If you can't, cut it: the 90% line already does the job. |
| "Vietnam is the second-biggest coffee producer on Earth" | Low. Widely accepted. | Add a USDA FAS or ICO source to the description. |
| "Thailand… just under 4 billion dollars, against Vietnam's 3.44 billion" (Ch2) | Medium | Add a source (China Customs via VnExpress, or similar). |
| "Vietnam's own government has now warned of oversupply" (Ch5) | Medium | Cite the ministry and date (MARD / Ministry of Agriculture & Environment). |
| "China declared it non-edible back in 2008" and "WHO's cancer agency lists it as a possible carcinogen" (Ch4) | Medium | Cite China's 2008 list of non-edible substances, and IARC (auramine, Group 2B). |
| "a third of all the socks on the planet" (close teaser) | Medium | This is usually said of Datang (Zhuji), but the figure is often from the 2000s. Check it before promising the next video, or soften it to "billions of pairs a year". |

**Link check:** three source links in your PDF have URLs that don't obviously match the claim they're cited for: VietNamNet (Douyin 30M), Produce Report (rubber) and Databoks #2 (Indonesia exports). Details are in `DESCRIPTION.md`.

## 3. Structure and retention

- **The hook is good.** Coffee $10k vs durian $76k is a strong first 15 seconds.
- **Tease the scandal early.** The dye story (Ch4) is your most clickable segment, and nothing in the cold open hints at it. Add one line, e.g. *"…and a dye scandal that shut the border."* That gives viewers a reason to stay past minute 5.
- **Chapter 1 opens slowly.** "If you've never met a durian…" is a gentle explainer right after the title card. Consider opening Ch1 with the Douyin / "durian freedom" beat, then explaining the fruit.
- **Answer the cold-open question more sharply.** The close implies the answer ("enormous influence over prices, standards and speed"). Say it as one memorable line, e.g. *"When one buyer takes 90%, it doesn't just buy your fruit. It sets your price, your rules and your clock."*

## 4. Channel fit: add the China side

GuoTalk is a China channel, but Chapters 2–5 are almost all Southeast Asian. Suggested 45–60 s additions, which would also bring the runtime back toward 11 min:
- **Ch3:** what the price drop means for a shopper in a Chinese city (durian at a supermarket, delivery apps, "durian freedom" becoming real).
- **Ch6:** why Beijing wants Hainan durian at all: food-security language and tree-ripened marketing.

## 5. Visual risks

- **Lan:** AFP's photos of him are copyrighted, so don't use them. Show his farm only with generic orchard footage and no faces, or use a clearly labelled illustration. Never show a stock farmer's face while saying "Lan".
- **Dye scandal:** the script already says never to show dyed flesh. The AI packing-line image follows that (closed fruit only).
- **Livestream (Ch5):** don't show the real Thai deputy prime minister or the influencer without licensed footage. The AI image uses an unidentifiable seller. It shows "$" prices; regenerate it with ฿ or no currency before publishing.
- **Maps:** the supply map in the video is a schematic, deliberately not a geographic map, which avoids border and claim disputes in the region. Keep it that way.

## 6. AI voice and YouTube

- The ElevenLabs narration (voice: "Cedric M – Engaging Documentary Narrator") is good enough to time the edit and review the cut.
- **Recommendation: record the final narration yourself.** Your own voice is the channel's brand. AI narration on its own isn't against YouTube's rules, but the monetization policy on "inauthentic" (mass-produced or repetitive) content means AI-voiced channels get closer scrutiny. To swap your voice in, see README → "Replace the voiceover".
- **AI images:** the 7 AI images are realistic and labelled "AI illustration" on screen. Also tick **"Altered or synthetic content"** in YouTube Studio when you upload.

## Next steps

1. Source or cut the six claims in section 2.
2. Decide between runtime option A and B.
3. Download the stock clips in `SHOT_LIST.md` (about 38 files).
4. Re-record the narration, re-run `npm run align`, then `npm run render`.
