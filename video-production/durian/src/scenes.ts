// Shot plan: one entry per narration paragraph (same order as narration/*.txt).
// `broll` = file id in public/broll/ (<id>.mp4 / .jpg / .png). Missing files render
// as a labelled placeholder, so the video always renders.
// `overlay` = motion graphic drawn on top. `source` = on-screen citation.

export type Overlay =
  | {type: 'stat'; value: string; label: string; sub?: string}
  | {type: 'bars'; title: string; items: {label: string; value: number; display: string; accent?: boolean}[]; note?: string}
  | {type: 'quote'; text: string; by: string; highlight?: string}
  | {type: 'note'; text: string; by: string; highlight?: string}
  | {type: 'callout'; text: string; sub?: string}
  | {type: 'route'; steps: {big: string; small: string}[]}
  | {type: 'timeline'; points: {year: string; label: string}[]}
  | {type: 'price'; from?: string; to: string; label: string}
  | {type: 'stamp'; text: string; sub: string}
  | {type: 'location'; text: string}
  | {type: 'map'; map: string}
  | {type: 'scribbles'; items: {text: string; x: number; y: number; rotate?: number; size?: number; delay?: number}[]};

// broll: footage ids in order of preference (real stock first, AI stand-in last).
export type Beat = {broll?: string[]; overlay?: Overlay; source?: string};

export const CHAPTER_TITLES: Record<string, string | null> = {
  '00-cold-open': null,
  '01-king-of-fruits': 'The King of Fruits',
  '02-gold-rush': 'The Gold Rush',
  '03-durian-express': 'The Durian Express',
  '04-yellow-scandal': 'The Yellow Scandal',
  '05-the-glut': 'The Glut',
  '06-the-twist': 'The Twist',
  '07-close': 'One Buyer',
};

const DURIAN_OPEN = ['durian-slowmo', 'durian-cut-open', 'ai-durian-open'];
const ORCHARD = ['durian-orchard', 'vietnam-orchard-aerial', 'ai-durian-orchard'];
const MARKET = ['china-market-durian', 'durian-pile', 'kunming-market', 'ai-durian-market'];

export const SCENES: Record<string, Beat[]> = {
  '00-cold-open': [
    {overlay: {type: 'map', map: 'highlands'}},
    {broll: ['coffee-cherries'], overlay: {type: 'stat', value: '#2', label: "Vietnam's rank in world coffee production"}},
    {source: 'AFP via The Vibes, 30 Aug 2026', overlay: {type: 'bars', title: "Lan's expected income this year", items: [{label: 'Coffee only', value: 10, display: '~$10,000'}, {label: 'With 400 durian trees', value: 76, display: '~$76,000', accent: true}], note: '7.6× more'}},
    {broll: ['ai-villa'], overlay: {type: 'scribbles', items: [{text: 'car ✓', x: 1160, y: 640, delay: 10}, {text: 'villa ✓', x: 700, y: 120, delay: 70, rotate: 4}]}},
    {overlay: {type: 'quote', text: "You can live okay with coffee, but it's durian that makes you rich.", by: 'Pham Xuan Lan, to AFP', highlight: "it's durian that makes you rich"}},
    {overlay: {type: 'map', map: 'china-glow'}},
    {source: 'The Standard; Produce Report', overlay: {type: 'map', map: 'sea-to-china'}},
    {broll: ['saplings', ...ORCHARD], overlay: {type: 'callout', text: 'Replanted for one customer'}},
    {overlay: {type: 'price', to: 'prices falling', label: '2026'}},
    {broll: DURIAN_OPEN, overlay: {type: 'callout', text: 'What happens when an entire industry depends on one buyer?'}},
  ],
  '01-king-of-fruits': [
    {broll: ['durian-closeup-spikes', 'ai-durian-closeup'], overlay: {type: 'scribbles', items: [{text: 'BIG', x: 220, y: 200, delay: 30}, {text: 'SPIKES', x: 1300, y: 260, delay: 60, rotate: 6}, {text: 'the SMELL...', x: 760, y: 800, delay: 100, rotate: -3}]}},
    {broll: DURIAN_OPEN},
    {source: 'Produce Report; China Customs via ECNS', overlay: {type: 'bars', title: "China's most valuable imported fruit, 2025", items: [{label: 'Durian', value: 7.49, display: '$7.49bn', accent: true}, {label: 'Bananas', value: 1.06, display: '$1.06bn'}], note: '1.87m tonnes, double 2022'}},
    {broll: ['phone-scroll'], source: 'Douyin e-commerce report via VietNamNet', overlay: {type: 'stat', value: '30,000,000', label: 'durian orders on one platform in a single year'}},
    {broll: ['durian-cut-open-2', ...DURIAN_OPEN], overlay: {type: 'callout', text: '榴莲自由', sub: '"durian freedom": buying one without checking the price'}},
    {overlay: {type: 'map', map: 'durian-belt'}},
    {source: 'Xinhua via The Star', overlay: {type: 'timeline', points: [{year: '1958', label: 'first planting attempt'}, {year: '2019', label: 'real breakthrough'}]}},
    {overlay: {type: 'map', map: 'which-country'}},
  ],
  '02-gold-rush': [
    {source: 'VAN', overlay: {type: 'map', map: 'thailand-only'}},
    {overlay: {type: 'map', map: 'vietnam-opens'}},
    {broll: ['durian-harvest', ...ORCHARD], overlay: {type: 'callout', text: 'A gold rush.'}},
    {source: 'AFP via The Vibes', overlay: {type: 'bars', title: "Vietnam's durian exports", items: [{label: '2021', value: 0.18, display: '$180m'}, {label: '2026 (expected)', value: 4, display: '~$4bn', accent: true}], note: 'durian land 5× in a decade (~200,000 ha)'}},
    {broll: ['ai-chainsaw-coffee'], source: 'Produce Report', overlay: {type: 'scribbles', items: [{text: 'coffee ✗', x: 330, y: 330, delay: 20}, {text: 'durian ✓', x: 1180, y: 250, delay: 60, rotate: 5}]}},
    {source: 'The Standard', overlay: {type: 'map', map: 'malaysia'}},
    {overlay: {type: 'bars', title: 'Durian exports to China by value, 2025', items: [{label: 'Thailand', value: 3.95, display: '< $4bn'}, {label: 'Vietnam', value: 3.44, display: '$3.44bn', accent: true}], note: 'but Vietnam is now #1 by volume'}},
    {broll: ['storm-clouds-farm', ...ORCHARD], overlay: {type: 'callout', text: 'Every gold rush has casualties.'}},
    {broll: ['coffee-farmer-hands'], source: 'AFP via The Vibes', overlay: {type: 'note', text: 'Farmer Hung: coffee → durian. Two years later, failed buyers\' quality standards. Back to coffee. "Never again."', by: 'AFP', highlight: 'Back to coffee.'}},
    {broll: ['durian-orchard-dusk', ...ORCHARD], overlay: {type: 'callout', text: 'You can do everything right, and still fail.', sub: 'Lan, on growing durian'}},
  ],
  '03-durian-express': [
    {broll: ['ai-truck-clock']},
    {broll: ['durian-packing', 'ai-packing-line'], source: 'Produce Report', overlay: {type: 'scribbles', items: [{text: 'picked before ripe', x: 980, y: 180, delay: 30}]}},
    {broll: ['highway-trucks', 'ai-truck-clock'], overlay: {type: 'callout', text: 'Faster.'}},
    {source: 'Xinhua via The Star', overlay: {type: 'map', map: 'rail'}},
    {broll: ['ai-freight-train'], source: 'Xinhua via The Star', overlay: {type: 'stat', value: '50,300 t', label: 'durians by rail, Jan–Apr 2026', sub: 'almost double a year earlier · up to 6 trains a day'}},
    {source: 'Xinhua via The Star', overlay: {type: 'map', map: 'sea-route'}},
    {source: 'Xinhua via The Star', overlay: {type: 'price', to: 'from ¥28 / kg', label: 'one Kunming wholesale market, spring 2026'}},
    {overlay: {type: 'map', map: 'cities'}},
  ],
  '04-yellow-scandal': [
    {broll: ['ai-packing-line']},
    {source: 'ITFNet; IARC', overlay: {type: 'note', text: 'Auramine O: industrial dye for textiles and paper. IARC: possible carcinogen. China: non-edible since 2008.', by: 'research notes', highlight: 'possible carcinogen'}},
    {broll: ['ai-customs-lab'], source: 'Produce Report, 12 Jan 2025', overlay: {type: 'stamp', text: 'REJECTED', sub: 'From 10 Jan 2025: tests for Auramine O and cadmium'}},
    {source: 'Vietnamese press via Antidumping.vn; Tuoi Tre', overlay: {type: 'bars', title: "Vietnam's durian exports to China, Jan–Apr", items: [{label: '2024', value: 500, display: '> $500m'}, {label: '2025', value: 125, display: '~$125m', accent: true}], note: 'only ~20% of plan'}},
    {source: 'Produce Report', overlay: {type: 'map', map: 'thai-labs'}},
    {broll: MARKET, overlay: {type: 'callout', text: 'Their standards become your standards.'}},
  ],
  '05-the-glut': [
    {broll: ['timelapse-growth', ...ORCHARD], overlay: {type: 'callout', text: '2026'}},
    {overlay: {type: 'timeline', points: [{year: 'plant', label: 'the boom years'}, {year: '5–8 yrs', label: 'full production'}]}},
    {source: 'FreshPlaza', overlay: {type: 'bars', title: 'Supply surge, 2026', items: [{label: 'Thailand harvest (forecast)', value: 2.07, display: '2.07m t (+33%)'}, {label: 'China imports, first half', value: 1.07, display: '1.07m t (+52%)', accent: true}]}},
    {broll: MARKET, overlay: {type: 'callout', text: 'More fruit. Same customer.'}},
    {source: 'The Standard', overlay: {type: 'price', from: 'last year', to: 'up to −50%', label: 'premium Vietnamese & Malaysian durian, wholesale'}},
    {broll: ['ai-livestream'], source: 'The Standard, 11 May 2026', overlay: {type: 'scribbles', items: [{text: 'farmers: furious', x: 1150, y: 160, delay: 120, rotate: 4}]}},
    {overlay: {type: 'map', map: 'vietnam-warn'}},
  ],
  '06-the-twist': [
    {overlay: {type: 'map', map: 'hainan'}},
    {broll: ['hainan-orchard', 'hainan-island'], overlay: {type: 'callout', text: 'China is growing its own.'}},
    {source: 'AFP via The Vibes', overlay: {type: 'map', map: 'hainan-close'}},
    {broll: ORCHARD, overlay: {type: 'callout', text: 'Should Southeast Asia panic?'}},
    {source: 'FreshPlaza; AFP via The Vibes', overlay: {type: 'stat', value: '< 1%', label: 'homegrown durian vs imports, 2025', sub: '"only ever a supplement": Hainan academy expert'}},
    {overlay: {type: 'callout', text: "It's the math."}},
  ],
  '07-close': [
    {overlay: {type: 'map', map: 'highlands'}},
    {overlay: {type: 'stat', value: '~90%', label: 'of global durian exports go to one buyer', sub: 'prices · standards · speed'}},
    {broll: ORCHARD},
    {broll: ['coffee-and-durian', 'coffee-cherries', 'ai-durian-orchard'], overlay: {type: 'callout', text: '400 durian trees. And still, coffee.'}},
    {overlay: {type: 'map', map: 'world'}},
    {overlay: {type: 'map', map: 'zhuji'}},
    {broll: DURIAN_OPEN},
  ],
};
