// Shot plan: one entry per narration paragraph (same order as narration/*.txt).
// `broll` = file id in public/broll/ (<id>.mp4 / .jpg / .png). Missing files render
// as a labelled placeholder, so the video always renders.
// `overlay` = motion graphic drawn on top. `source` = on-screen citation.

export type Overlay =
  | {type: 'stat'; value: string; label: string; sub?: string}
  | {type: 'bars'; title: string; items: {label: string; value: number; display: string; accent?: boolean}[]; note?: string}
  | {type: 'quote'; text: string; by: string}
  | {type: 'callout'; text: string; sub?: string}
  | {type: 'flow'; active: ('thailand' | 'vietnam' | 'malaysia')[]; caption?: string}
  | {type: 'route'; steps: {big: string; small: string}[]}
  | {type: 'timeline'; points: {year: string; label: string}[]}
  | {type: 'price'; from?: string; to: string; label: string}
  | {type: 'stamp'; text: string; sub: string}
  | {type: 'location'; text: string};

export type Beat = {broll: string; overlay?: Overlay; source?: string};

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

export const SCENES: Record<string, Beat[]> = {
  '00-cold-open': [
    {broll: 'highlands-dawn', overlay: {type: 'location', text: 'Central Highlands, Vietnam'}},
    {broll: 'coffee-cherries', overlay: {type: 'stat', value: '#2', label: "Vietnam's rank in world coffee production"}},
    {broll: 'durian-orchard', source: 'AFP via The Vibes, 30 Aug 2026', overlay: {type: 'bars', title: "Lan's expected income this year", items: [{label: 'Coffee only', value: 10, display: '~$10,000'}, {label: 'With 400 durian trees', value: 76, display: '~$76,000', accent: true}]}},
    {broll: 'ai-villa'},
    {broll: 'durian-tree-fruit', overlay: {type: 'quote', text: "You can live okay with coffee, but it's durian that makes you rich.", by: 'Pham Xuan Lan, to AFP'}},
    {broll: 'durian-pile', overlay: {type: 'callout', text: 'One buyer.'}},
    {broll: 'china-market-durian', source: 'The Standard; Produce Report', overlay: {type: 'stat', value: '~90%', label: "of the world's durian exports go to China", sub: '2025 imports: $7.49 billion'}},
    {broll: 'saplings'},
    {broll: 'durian-market-price', overlay: {type: 'price', to: 'Prices falling', label: '2026'}},
    {broll: 'durian-slowmo', overlay: {type: 'callout', text: 'What happens when an entire industry depends on one buyer?'}},
  ],
  '01-king-of-fruits': [
    {broll: 'durian-closeup-spikes'},
    {broll: 'durian-cut-open'},
    {broll: 'china-fruit-market', source: 'Produce Report; China Customs via ECNS', overlay: {type: 'bars', title: "China's most valuable imported fruit, 2025", items: [{label: 'Durian', value: 7.49, display: '$7.49bn', accent: true}, {label: 'Bananas', value: 1.06, display: '$1.06bn'}], note: 'Durian: 1.87m tonnes, double 2022'}},
    {broll: 'phone-scroll', source: 'Douyin e-commerce report via VietNamNet', overlay: {type: 'stat', value: '30 million', label: 'durian orders on one platform in a single year'}},
    {broll: 'durian-cut-open-2', overlay: {type: 'callout', text: '榴莲自由', sub: '"Durian freedom": buying one without checking the price'}},
    {broll: 'hainan-landscape', overlay: {type: 'callout', text: 'Durian barely grows in China.'}},
    {broll: 'durian-tree-fruit', source: 'Xinhua via The Star', overlay: {type: 'timeline', points: [{year: '1958', label: 'First planting attempt'}, {year: '2019', label: 'Real breakthrough'}]}},
    {broll: 'durian-pile', overlay: {type: 'flow', active: [], caption: 'Nearly all fresh durian came from one country…'}},
  ],
  '02-gold-rush': [
    {broll: 'thailand-durian-farm', source: 'VAN', overlay: {type: 'flow', active: ['thailand'], caption: '2021: Thailand ≈ 100% of China\'s fresh durian imports'}},
    {broll: 'vietnam-orchard-aerial', overlay: {type: 'flow', active: ['thailand', 'vietnam'], caption: '2022: China approves Vietnamese durian'}},
    {broll: 'durian-harvest', overlay: {type: 'callout', text: 'A gold rush.'}},
    {broll: 'vietnam-orchard-aerial', source: 'AFP via The Vibes', overlay: {type: 'bars', title: "Vietnam's durian exports", items: [{label: '2021', value: 0.18, display: '$180m'}, {label: '2026 (expected)', value: 4, display: '~$4bn', accent: true}], note: 'Durian land: 5× in a decade, ~200,000 ha'}},
    {broll: 'ai-chainsaw-coffee', source: 'Produce Report'},
    {broll: 'mangosteen', source: 'The Standard', overlay: {type: 'callout', text: 'Mangosteen now costs more than some premium durians', sub: 'Malaysia'}},
    {broll: 'durian-truck-loading', overlay: {type: 'bars', title: 'Durian exports to China by value, 2025', items: [{label: 'Thailand', value: 3.95, display: '< $4bn'}, {label: 'Vietnam', value: 3.44, display: '$3.44bn', accent: true}], note: 'Vietnam is now #1 by volume'}},
    {broll: 'storm-clouds-farm', overlay: {type: 'callout', text: 'Every gold rush has casualties.'}},
    {broll: 'coffee-farmer-hands', source: 'AFP via The Vibes'},
    {broll: 'durian-orchard-dusk', overlay: {type: 'callout', text: 'You can do everything right, and still fail.', sub: 'Lan, on growing durian'}},
  ],
  '03-durian-express': [
    {broll: 'ai-truck-clock'},
    {broll: 'durian-packing', source: 'Produce Report'},
    {broll: 'highway-trucks', overlay: {type: 'callout', text: 'Faster.'}},
    {broll: 'china-laos-railway', source: 'Xinhua via The Star', overlay: {type: 'route', steps: [{big: '26 h', small: 'Thailand → Kunming by cold-chain train'}, {big: '48 h', small: 'in 30+ Chinese cities'}]}},
    {broll: 'ai-freight-train', source: 'Xinhua via The Star', overlay: {type: 'stat', value: '50,300 t', label: 'durians by rail, Jan–Apr 2026', sub: 'almost double a year earlier · up to 6 trains a day'}},
    {broll: 'container-ship', source: 'Xinhua via The Star', overlay: {type: 'route', steps: [{big: '10×', small: '"durian express" sailings a week'}, {big: '4 days', small: 'Thailand → southern China'}, {big: '4 h → 15 min', small: 'customs clearance at one border port'}]}},
    {broll: 'kunming-market', source: 'Xinhua via The Star', overlay: {type: 'price', to: 'from ¥28 / kg', label: 'one Kunming wholesale market, spring 2026'}},
    {broll: 'supermarket-durian', overlay: {type: 'callout', text: 'Luxury fruit → everyday fruit'}},
  ],
  '04-yellow-scandal': [
    {broll: 'ai-packing-line'},
    {broll: 'turmeric', source: 'ITFNet; IARC', overlay: {type: 'callout', text: 'Auramine O', sub: 'Industrial dye · IARC: possible carcinogen · non-edible in China since 2008'}},
    {broll: 'ai-customs-lab', source: 'Produce Report, 12 Jan 2025', overlay: {type: 'stamp', text: 'REJECTED', sub: 'From 10 Jan 2025: lab tests for Auramine O and cadmium'}},
    {broll: 'vietnam-port-trucks', source: 'Vietnamese press via Antidumping.vn; Tuoi Tre', overlay: {type: 'bars', title: "Vietnam's durian exports to China, Jan–Apr", items: [{label: '2024', value: 500, display: '> $500m'}, {label: '2025', value: 125, display: '~$120–130m', accent: true}], note: 'About 20% of plan'}},
    {broll: 'lab-testing', source: 'Produce Report'},
    {broll: 'durian-pile', overlay: {type: 'callout', text: 'Their standards become your standards.'}},
  ],
  '05-the-glut': [
    {broll: 'timelapse-growth'},
    {broll: 'durian-orchard', overlay: {type: 'callout', text: '5–8 years', sub: 'for a durian tree to reach full production'}},
    {broll: 'durian-harvest', source: 'FreshPlaza', overlay: {type: 'bars', title: 'Supply surge, 2026', items: [{label: 'Thailand harvest (forecast)', value: 2.07, display: '2.07m t (+33%)'}, {label: 'China imports, H1', value: 1.07, display: '1.07m t (+52%)', accent: true}]}},
    {broll: 'durian-pile', overlay: {type: 'callout', text: 'More fruit. Same customer.'}},
    {broll: 'durian-market-price', source: 'The Standard', overlay: {type: 'price', from: '100%', to: 'up to −50%', label: 'Premium Vietnamese & Malaysian wholesale prices vs 2025'}},
    {broll: 'ai-livestream', source: 'The Standard, 11 May 2026'},
    {broll: 'vietnam-orchard-aerial', overlay: {type: 'callout', text: 'Oversupply warning', sub: 'Government of Vietnam'}},
  ],
  '06-the-twist': [
    {broll: 'hainan-island'},
    {broll: 'hainan-orchard', overlay: {type: 'callout', text: 'China is growing its own.'}},
    {broll: 'hainan-orchard', source: 'AFP via The Vibes', overlay: {type: 'stat', value: '3,000+ ha', label: 'of durian orchards on Hainan', sub: 'sold as "tree-ripened"'}},
    {broll: 'durian-orchard-dusk', overlay: {type: 'callout', text: 'Should Southeast Asia panic?'}},
    {broll: 'hainan-orchard', source: 'FreshPlaza; AFP via The Vibes', overlay: {type: 'stat', value: '< 1%', label: 'homegrown durian vs imports, 2025', sub: '"Only ever a supplement", Hainan agricultural academy expert'}},
    {broll: 'durian-pile', overlay: {type: 'callout', text: "It's the math."}},
  ],
  '07-close': [
    {broll: 'lan-farm-dusk'},
    {broll: 'china-market-durian', overlay: {type: 'stat', value: '~90%', label: 'of global durian exports, one buyer', sub: 'Influence over prices · standards · speed'}},
    {broll: 'durian-orchard'},
    {broll: 'coffee-and-durian', overlay: {type: 'callout', text: '400 durian trees. And still, coffee.'}},
    {broll: 'container-ship', overlay: {type: 'callout', text: 'Durian isn\'t the only one.'}},
    {broll: 'socks-factory', overlay: {type: 'callout', text: '⅓ of the world\'s socks', sub: 'One small Chinese town · next video'}},
    {broll: 'durian-slowmo'},
  ],
};
