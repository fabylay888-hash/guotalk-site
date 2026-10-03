import type {BoardCard} from './components/Devices';
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
  | {type: 'scribbles'; items: {text: string; x: number; y: number; rotate?: number; size?: number; delay?: number}[]}
  | {type: 'grid'; n: number; label: string; sub?: string; hitColor?: string; target?: string; big?: string}
  | {type: 'receipt'; title: string; lines: [string, string][]; total?: [string, string]; footer?: string; bg?: string[]}
  | {type: 'tag'; price: string; label: string; old?: string; bg?: string[]}
  | {type: 'clock'; mode: 'count' | 'shrink'; value: number; unit: string; from?: string; to?: string; label: string; bg?: string[]}
  | {type: 'depart'; title: string; rows: [string, string, string][]; footer?: string}
  | {type: 'phone'; clips: string[]; counter: {label: string; value: number}; live?: boolean; caption: string}
  | {type: 'board'; cards: BoardCard[]; strings: [string, string, number][]; focus?: [number, number]}
  | {type: 'doc'; header: string; fields: [string, string][]; stamp?: string; note?: string}
  | {type: 'split'; left: {ids?: string[]; label: string; value: string}; right: {ids?: string[]; label: string; value: string}; title?: string}
  | {type: 'statover'; value: string; label: string; sub?: string; ids?: string[]; center?: boolean}
  | {type: 'mapdive'; map: string; ids?: string[]; at: number}
  | {type: 'growth'; fromLabel: string; toLabel: string; toValue: number; prefix: string; suffix: string; times: string; caption: string; ids?: string[]}
  // Several full-frame graphics back to back inside one paragraph; `at` = start fractions.
  | {type: 'seq'; parts: Overlay[]; at: number[]};

// broll: footage ids in order of preference (real stock first, AI stand-in last).
// tr: entry transition for the beat (whip pan, or a film-burn flash on big reveals).
export type Beat = {broll?: string[]; overlay?: Overlay; source?: string; tr?: 'whip' | 'burn'};

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
const MARKET = ['china-market-durian', 'kunming-market', 'durian-pile', 'ai-durian-market'];
const COFFEE = ['coffee-cherries', 'coffee-farmer-hands', 'coffee-and-durian', 'ai-coffee-picking'];
const CN = {key: 'china', x: 810, y: 430, rot: 0, title: 'CHINA', text: 'buys ~90% of world durian exports', at: 0, red: true};

export const SCENES: Record<string, Beat[]> = {
  '00-cold-open': [
    {overlay: {type: 'mapdive', map: 'highlands', ids: ['highlands-dawn', 'coffee-cherries', 'ai-coffee-picking'], at: 0.74}},
    {overlay: {type: 'statover', center: true, value: '#2', label: "Vietnam: world's no. 2 coffee producer", ids: COFFEE}},
    {source: 'AFP via The Vibes, 30 Aug 2026', tr: 'whip', overlay: {type: 'split', title: "Lan's expected income this year", left: {ids: COFFEE, label: 'coffee alone', value: '~$10,000'}, right: {ids: ['durian-orchard', 'ai-durian-farmer'], label: '400 durian trees', value: '~$76,000'}}},
    {broll: ['ai-villa'], overlay: {type: 'scribbles', items: [{text: 'car ✓', x: 1160, y: 640, delay: 10}, {text: 'villa ✓', x: 700, y: 120, delay: 70, rotate: 4}]}},
    {source: 'AFP via The Vibes', overlay: {type: 'board', cards: [
      {key: 'lan', x: 200, y: 200, rot: -4, w: 560, img: ['ai-villa'], title: 'Pham Xuan Lan', text: 'Central Highlands · coffee + 400 durian trees', at: 0},
      {key: 'q', x: 1060, y: 330, rot: 3, w: 640, title: '"You can live okay with coffee, but it\'s durian that makes you rich."', text: 'Lan, to AFP (Agence France-Presse, the French news agency)', at: 18},
    ], strings: [['lan', 'q', 34]]}},
    {overlay: {type: 'map', map: 'china-glow'}},
    {source: 'The Standard; Produce Report', tr: 'burn', overlay: {type: 'seq', at: [0, 0.4], parts: [
      {type: 'grid', n: 90, big: '~90%', label: "Of every 100 durians the world exports...", sub: '~90 go to China'},
      {type: 'growth', fromLabel: 'a decade earlier', toLabel: 'last year (2025)', toValue: 7.5, prefix: '$', suffix: 'bn', times: '×12', caption: "China's spending on durian imports", ids: ['ai-durian-market']},
    ]}},
    {broll: ['saplings', ...ORCHARD], tr: 'whip', overlay: {type: 'callout', text: 'Replanted for one customer'}},
    {overlay: {type: 'statover', value: '↓', label: 'and this year, prices are falling', ids: MARKET}},
    {broll: DURIAN_OPEN, overlay: {type: 'callout', text: 'What happens when an entire industry depends on one buyer?'}},
  ],
  '01-king-of-fruits': [
    {broll: ['durian-closeup-spikes', 'ai-durian-closeup'], overlay: {type: 'scribbles', items: [{text: 'BIG', x: 220, y: 200, delay: 30}, {text: 'SPIKES', x: 1300, y: 260, delay: 60, rotate: 6}, {text: 'the SMELL...', x: 760, y: 800, delay: 100, rotate: -3}]}},
    {broll: DURIAN_OPEN},
    {source: 'Produce Report; China Customs via ECNS', overlay: {type: 'receipt', title: 'CHINA FRUIT IMPORTS 2025', lines: [['DURIAN (fresh)', '$7.49bn'], ['  1.87m tonnes', '2× 2022'], ['BANANAS', '$1.06bn']], total: ['NO.1 BY VALUE', 'DURIAN'], footer: 'illustrative · source: China Customs', bg: MARKET}},
    {source: 'Douyin e-commerce report via VietNamNet', overlay: {type: 'phone', clips: ['phone-scroll', 'durian-slowmo', 'durian-cut-open', 'durian-cut-open-2', 'ai-durian-open', 'ai-durian-closeup', 'ai-durian-market'], counter: {label: 'durian orders, one platform, one year', value: 30000000}, caption: 'billions of views'}},
    {broll: ['durian-cut-open-2', ...DURIAN_OPEN], tr: 'whip', overlay: {type: 'callout', text: '榴莲自由', sub: '"durian freedom": buying one without checking the price'}},
    {overlay: {type: 'map', map: 'durian-belt'}},
    {source: 'Xinhua via The Star', overlay: {type: 'timeline', points: [{year: '1958', label: 'first planting attempt'}, {year: '2019', label: 'real breakthrough'}]}},
    {overlay: {type: 'map', map: 'which-country'}},
  ],
  '02-gold-rush': [
    {source: 'VAN', overlay: {type: 'map', map: 'thailand-only'}},
    {overlay: {type: 'map', map: 'vietnam-opens'}},
    {broll: ['durian-harvest', 'ai-durian-farmer', ...ORCHARD], tr: 'burn', overlay: {type: 'callout', text: 'A gold rush.'}},
    {source: 'AFP via The Vibes', overlay: {type: 'statover', value: '$180m → $4bn', label: "Vietnam's durian exports, 2021 → 2026 (expected)", sub: 'durian land: 5× in a decade', ids: ['vietnam-orchard-aerial', ...ORCHARD]}},
    {source: 'Produce Report', overlay: {type: 'seq', at: [0, 0.5], parts: [{type: 'statover', value: 'coffee ✗', label: 'Vietnam: coffee trees cut down', ids: ['ai-chainsaw-coffee']}, {type: 'statover', value: 'rubber ✗', label: 'southern Thailand: rubber ripped out', ids: ['rubber-plantation', 'ai-durian-orchard']}]}},
    {source: 'The Standard', overlay: {type: 'seq', at: [0, 0.42], parts: [{type: 'map', map: 'malaysia'}, {type: 'statover', value: 'mangosteen', label: 'once the cheap fruit, now pricier than some premium durians', ids: ['mangosteen']}]}},
    {tr: 'whip', overlay: {type: 'split', title: 'Durian exports to China, 2025', left: {ids: ['thailand-durian-farm', 'ai-durian-market'], label: 'Thailand · by value', value: '< $4bn'}, right: {ids: ['vietnam-orchard-aerial', 'ai-durian-orchard'], label: 'Vietnam · now #1 by volume', value: '$3.44bn'}}},
    {broll: ['storm-clouds-farm', ...ORCHARD], overlay: {type: 'callout', text: 'Every gold rush has casualties.'}},
    {source: 'AFP via The Vibes', overlay: {type: 'board', cards: [
      {key: 'hung', x: 120, y: 260, rot: -3, w: 480, img: ['coffee-farmer-hands', 'coffee-cherries', 'ai-chainsaw-coffee'], title: 'Farmer Hung', text: 'switched the whole farm to durian', at: 0},
      {key: 'fail', x: 740, y: 150, rot: 2, w: 460, title: '2 years later', text: "couldn't meet buyers' quality standards", at: 30, red: true},
      {key: 'back', x: 1340, y: 420, rot: -2, w: 460, title: 'Back to coffee.', text: '"never again" (to AFP)', at: 70},
    ], strings: [['hung', 'fail', 44], ['fail', 'back', 84]]}},
    {broll: ['durian-young', ...ORCHARD], overlay: {type: 'callout', text: 'You can do everything right, and still fail.', sub: 'Lan: growing durian is like raising a child'}},
  ],
  '03-durian-express': [
    {broll: ['ai-truck-clock'], overlay: {type: 'scribbles', items: [{text: 'the clock is ticking...', x: 1060, y: 160, delay: 20}]}},
    {broll: ['durian-packing', 'ai-packing-line'], source: 'Produce Report', overlay: {type: 'scribbles', items: [{text: 'picked before ripe', x: 980, y: 180, delay: 30}]}},
    {broll: ['highway-trucks', 'ai-truck-clock'], tr: 'whip', overlay: {type: 'callout', text: 'Faster.'}},
    {source: 'Xinhua via The Star', overlay: {type: 'seq', at: [0, 0.42, 0.68], parts: [{type: 'map', map: 'rail'}, {type: 'statover', value: '26 h', label: 'Thailand → Kunming on the China–Laos Railway', ids: ['china-laos-railway', 'ai-freight-train']}, {type: 'map', map: 'cities'}]}},
    {source: 'Xinhua via The Star', tr: 'whip', overlay: {type: 'depart', title: 'KUNMING · COLD-CHAIN FREIGHT · DURIAN', rows: [['06:10', 'VIENTIANE', 'ON TIME'], ['09:40', 'VIENTIANE', 'ON TIME'], ['13:05', 'BOTEN', 'ON TIME'], ['16:30', 'VIENTIANE', 'ON TIME'], ['20:15', 'BOTEN', 'ON TIME'], ['23:50', 'VIENTIANE', 'ON TIME']], footer: 'up to 6 trains a day · 50,300 t of durian, Jan–Apr 2026 (≈2× a year earlier)'}},
    {source: 'Xinhua via The Star', overlay: {type: 'seq', at: [0, 0.6], parts: [{type: 'map', map: 'sea-route'}, {type: 'clock', mode: 'shrink', value: 0, unit: '', from: '4 hours', to: '15 min', label: 'Customs clearance at one border port', bg: ['container-ship', 'border-trucks', 'ai-durian-market']}]}},
    {source: 'Xinhua via The Star', tr: 'burn', overlay: {type: 'tag', price: '¥28/kg', label: 'Thai durian, one Kunming wholesale market, spring 2026', bg: MARKET}},
    {broll: ['supermarket-durian', ...MARKET], tr: 'whip', overlay: {type: 'callout', text: 'Luxury fruit → everyday fruit'}},
  ],
  '04-yellow-scandal': [
    {broll: ['ai-packing-line']},
    {source: 'ITFNet; IARC', overlay: {type: 'doc', header: 'SUBSTANCE FILE', fields: [['substance', 'Auramine O'], ['made for', 'textiles & paper dye'], ['IARC (WHO)', 'possible carcinogen'], ['China', 'non-edible since 2008']]}},
    {source: 'Produce Report, 12 Jan 2025', overlay: {type: 'doc', header: 'IMPORT INSPECTION · FRESH DURIAN', fields: [['from', '10 Jan 2025'], ['test 1', 'Auramine O'], ['test 2', 'cadmium'], ['result', 'batch turned away']], stamp: 'REJECTED'}},
    {source: 'Vietnamese press via Antidumping.vn; Tuoi Tre', overlay: {type: 'statover', value: '~20%', label: "of plan: Vietnam's durian exports to China, Jan–Apr 2025", sub: '> $500m → ~$125m', ids: ['border-trucks', 'vietnam-port-trucks', 'ai-durian-market']}},
    {source: 'Produce Report', overlay: {type: 'map', map: 'thai-labs'}},
    {broll: MARKET, overlay: {type: 'callout', text: 'Their standards become your standards.'}},
  ],
  '05-the-glut': [
    {broll: ['timelapse-growth', ...ORCHARD], tr: 'whip', overlay: {type: 'callout', text: '2026'}},
    {overlay: {type: 'statover', value: '5–8 yrs', label: 'for a durian tree to reach full production', sub: 'the boom trees all matured together', ids: ORCHARD}},
    {source: 'FreshPlaza', overlay: {type: 'bars', title: 'Supply surge, 2026', items: [{label: 'Thailand harvest (forecast)', value: 2.07, display: '2.07m t (+33%)'}, {label: 'China imports, first half', value: 1.07, display: '1.07m t (+52%)', accent: true}]}},
    {broll: MARKET, overlay: {type: 'callout', text: 'More fruit. Same customer.'}},
    {source: 'The Standard', tr: 'burn', overlay: {type: 'tag', old: 'last year', price: 'up to −50%', label: 'wholesale: premium Vietnamese & Malaysian durian', bg: ['price-board', ...MARKET]}},
    {source: 'The Standard, 11 May 2026', overlay: {type: 'phone', live: true, clips: ['ai-livestream', 'ai-durian-market'], counter: {label: 'durians sold on the livestream', value: 120000}, caption: 'farmers: furious'}},
    {overlay: {type: 'map', map: 'vietnam-warn'}},
  ],
  '06-the-twist': [
    {overlay: {type: 'map', map: 'hainan'}},
    {broll: ['hainan-orchard', 'hainan-island', ...ORCHARD], overlay: {type: 'callout', text: 'China is growing its own.'}},
    {source: 'AFP via The Vibes', overlay: {type: 'map', map: 'hainan-close'}},
    {broll: ORCHARD, tr: 'whip', overlay: {type: 'callout', text: 'Should Southeast Asia panic?'}},
    {source: 'FreshPlaza; AFP via The Vibes', overlay: {type: 'grid', n: 1, target: '', hitColor: '#3F7A3A', label: 'Durian China eats: homegrown vs imported', sub: 'homegrown: < 1 in 100 (2025)'}},
    {overlay: {type: 'callout', text: "It's the math."}},
  ],
  '07-close': [
    {overlay: {type: 'map', map: 'highlands'}},
    {overlay: {type: 'statover', value: '~90%', label: 'of global durian exports, one buyer', sub: 'prices · standards · speed', ids: MARKET}},
    {broll: ORCHARD},
    {broll: ['coffee-and-durian', ...COFFEE, 'ai-durian-orchard'], overlay: {type: 'callout', text: '400 durian trees. And still, coffee.'}},
    {overlay: {type: 'map', map: 'world'}},
    {overlay: {type: 'map', map: 'zhuji'}},
    {tr: 'whip', overlay: {type: 'board', focus: [960, 520], cards: [
      CN,
      {key: 'lan', x: 140, y: 120, rot: -4, img: ['ai-villa'], title: 'Lan', text: 'got rich, kept his coffee', at: 4},
      {key: 'hung', x: 140, y: 620, rot: 3, img: ['coffee-farmer-hands', 'ai-chainsaw-coffee'], title: 'Hung', text: 'back to coffee', at: 10},
      {key: 'th', x: 560, y: 70, rot: 2, img: ['thailand-durian-farm', 'ai-durian-market'], title: 'Thailand', text: 'dye scandal → own labs', at: 16},
      {key: 'vn', x: 1160, y: 80, rot: -2, img: ['vietnam-orchard-aerial', 'ai-durian-orchard'], title: 'Vietnam', text: 'gold rush → oversupply', at: 22},
      {key: 'my', x: 1480, y: 520, rot: 4, img: ['malaysia-durian', 'ai-durian-open'], title: 'Malaysia', text: 'prices down by half', at: 28},
      {key: 'hn', x: 1100, y: 700, rot: -3, img: ['hainan-island', 'hainan-orchard'], title: 'Hainan', text: '< 1% of supply', at: 34},
    ], strings: [['lan', 'china', 40], ['hung', 'china', 44], ['th', 'china', 48], ['vn', 'china', 52], ['my', 'china', 56], ['hn', 'china', 60]]}},
  ],
};
