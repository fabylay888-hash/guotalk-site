// B-roll catalog. Single source of truth for both the video placeholders and SHOT_LIST.md.
// kind: stock = free stock (Pexels/Pixabay: free commercial use, no attribution required)
//       commons = Wikimedia Commons (CC licence: credit the author in the description)
//       ai = generate (script calls for an AI visual); keep it obviously illustrative
export type Shot = {what: string; kind: 'stock' | 'commons' | 'ai'; query: string; picks?: {label: string; url: string}[]};

const px = (q: string) => `https://www.pexels.com/search/videos/${encodeURIComponent(q)}/`;
const pb = (q: string) => `https://pixabay.com/videos/search/${encodeURIComponent(q)}/`;
export const searchLinks = (q: string) => [
  {label: 'Pexels videos', url: px(q)},
  {label: 'Pixabay videos', url: pb(q)},
];

export const SHOTS: Record<string, Shot> = {
  'highlands-dawn': {what: 'Dawn / mist over Vietnam Central Highlands farmland (aerial if possible)', kind: 'stock', query: 'vietnam highlands aerial', picks: [
    {label: 'Pexels: Aerial view of Dak Bla River, Vietnam (Kon Tum, Central Highlands)', url: 'https://www.pexels.com/video/scenic-aerial-view-of-dak-bla-river-in-vietnam-28924987/'},
    {label: 'Pixabay: Vietnam, drones, Da Lat', url: 'https://pixabay.com/videos/vietnam-drones-da-lat-268023/'}]},
  'coffee-cherries': {what: 'Coffee cherries on the branch / farmer checking cherries', kind: 'stock', query: 'coffee cherries', picks: [
    {label: 'Pexels video: A farmer checking the coffee cherries', url: 'https://www.pexels.com/video/a-framer-checking-the-coffee-cherries-7116410/'},
    {label: 'Pexels photo: Ripe coffee cherries in Vietnamese highlands', url: 'https://www.pexels.com/photo/ripe-coffee-cherries-on-tree-in-vietnamese-highlands-29639312/'}]},
  'durian-orchard': {what: 'Rows of durian trees with fruit hanging', kind: 'stock', query: 'durian tree', picks: [
    {label: 'Pixabay video: Durian, Vietnam, garden', url: 'https://pixabay.com/videos/durian-vietnam-garden-tree-leaf-166216/'}]},
  'ai-villa': {what: 'AI visual: a new car parked outside a new rural villa in Vietnam (script: car, then villa)', kind: 'ai', query: 'vietnam countryside house'},
  'durian-tree-fruit': {what: 'Close-up: spiky durians hanging on the branch', kind: 'stock', query: 'durian fruit tree', picks: [
    {label: 'Pixabay video: Durian, Vietnam, garden', url: 'https://pixabay.com/videos/durian-vietnam-garden-tree-leaf-166216/'},
    {label: 'Commons: Durian fruit in Yunnan', url: 'https://commons.wikimedia.org/wiki/File:Durian_Fruit_in_Yunnan.jpg'}]},
  'durian-pile': {what: 'Big pile / crates of durians (market or packing yard)', kind: 'stock', query: 'durian market', picks: [
    {label: 'Commons: Durians in Chiang Rai, Thailand', url: 'https://commons.wikimedia.org/wiki/File:Chiang_Rai-Durian-02-2007-gje.jpg'},
    {label: 'Commons: Category "Durian" (browse)', url: 'https://commons.wikimedia.org/wiki/Category:Durian'}]},
  'china-market-durian': {what: 'Durians on sale in a Chinese market or supermarket', kind: 'commons', query: 'durian china market', picks: [
    {label: 'Commons: Durian fruit in Yunnan', url: 'https://commons.wikimedia.org/wiki/File:Durian_Fruit_in_Yunnan.jpg'}]},
  'saplings': {what: 'Young tree saplings being planted in rows', kind: 'stock', query: 'planting seedlings farm'},
  'durian-market-price': {what: 'Market stall, price signs, vendor weighing durian', kind: 'stock', query: 'fruit market asia'},
  'durian-slowmo': {what: 'HERO SHOT: durian split open in slow motion, golden pods', kind: 'stock', query: 'durian', picks: [
    {label: 'Pexels photo: Man cutting a durian fruit', url: 'https://www.pexels.com/photo/man-cutting-a-durian-fruit-19142290/'},
    {label: 'Pexels search: durian fruit videos', url: 'https://www.pexels.com/search/videos/durian%20fruit/'},
    {label: 'Coverr: durian (free)', url: 'https://coverr.co/stock-video-footage/durian'}]},
  'durian-closeup-spikes': {what: 'Macro of durian husk spikes, slow push-in', kind: 'stock', query: 'durian close up'},
  'durian-cut-open': {what: 'Hands cracking open a durian, revealing pods', kind: 'stock', query: 'durian open', picks: [
    {label: 'Pexels photo: Man cutting a durian fruit', url: 'https://www.pexels.com/photo/man-cutting-a-durian-fruit-19142290/'}]},
  'durian-cut-open-2': {what: 'Someone eating durian / durian pods on a plate', kind: 'stock', query: 'eating durian'},
  'china-fruit-market': {what: 'Busy Chinese fruit wholesale market', kind: 'stock', query: 'china fruit market'},
  'phone-scroll': {what: 'Thumb scrolling short vertical videos on a phone (blur any app logos)', kind: 'stock', query: 'scrolling phone', picks: [
    {label: 'Pexels: Scrolling through social media on smartphone', url: 'https://www.pexels.com/video/scrolling-through-social-media-on-smartphone-38410501/'},
    {label: 'Pexels: A person scrolling through a mobile phone', url: 'https://www.pexels.com/video/a-person-scrolling-through-a-mobile-phone-6271585/'}]},
  'hainan-landscape': {what: 'Tropical southern China landscape, wind in trees', kind: 'commons', query: 'hainan', picks: [
    {label: 'Commons: Haitang Bay in Sanya (aerial)', url: 'https://commons.wikimedia.org/wiki/File:Haitang_Bay_in_Sanya.jpg'}]},
  'thailand-durian-farm': {what: 'Thai durian orchard / Thai durian market (Chanthaburi)', kind: 'stock', query: 'thailand durian', picks: [
    {label: 'Commons: Durian, Bangkok / Khon Kaen supermarket', url: 'https://commons.wikimedia.org/wiki/File:Durian_Bangkok.jpg'}]},
  'vietnam-orchard-aerial': {what: 'Aerial over Vietnamese orchards (Mekong Delta or Highlands)', kind: 'stock', query: 'vietnam farm aerial'},
  'durian-harvest': {what: 'Farmers harvesting durians, loading baskets', kind: 'stock', query: 'durian harvest'},
  'ai-chainsaw-coffee': {what: 'AI visual: a chainsaw, a coffee tree falling, a durian sapling planted in its place', kind: 'ai', query: 'cutting tree chainsaw'},
  'mangosteen': {what: 'Mangosteen being opened, purple rind, white segments', kind: 'stock', query: 'mangosteen', picks: [
    {label: 'Pexels search: mangosteen videos', url: 'https://www.pexels.com/search/videos/mangosteen/'}]},
  'durian-truck-loading': {what: 'Durians loaded onto trucks / into containers', kind: 'stock', query: 'loading fruit truck'},
  'storm-clouds-farm': {what: 'Dark clouds rolling over farmland (mood shift)', kind: 'stock', query: 'storm clouds farm'},
  'coffee-farmer-hands': {what: "Farmer's hands sorting coffee beans", kind: 'stock', query: 'coffee farmer'},
  'durian-orchard-dusk': {what: 'Orchard at dusk, silhouettes, golden light', kind: 'stock', query: 'orchard sunset'},
  'ai-truck-clock': {what: 'AI visual: a durian on a truck, a long road, a clock ticking', kind: 'ai', query: 'truck long road'},
  'durian-packing': {what: 'Packing house: durians sorted and boxed', kind: 'stock', query: 'fruit packing'},
  'highway-trucks': {what: 'Trucks on a highway, time-lapse / aerial', kind: 'stock', query: 'truck highway aerial', picks: [
    {label: 'Pexels: Aerial footage of truck on the road', url: 'https://www.pexels.com/video/aerial-footage-of-truck-on-the-road-9339061/'},
    {label: 'Pexels: A transport truck on the highway at night', url: 'https://www.pexels.com/video/a-transport-truck-on-the-highway-at-night-5266051/'}]},
  'china-laos-railway': {what: 'China–Laos Railway train crossing a bridge', kind: 'commons', query: 'train bridge mountains', picks: [
    {label: 'Commons: China–Laos train crossing the Mekong north of Luang Prabang', url: 'https://commons.wikimedia.org/wiki/File:China-Laos_train,_going_over_the_Mekong_river_north_of_Luang_Prabang,_Laos.jpg'}]},
  'ai-freight-train': {what: 'AI visual: refrigerated freight train crossing mountain bridges', kind: 'ai', query: 'freight train mountains'},
  'container-ship': {what: 'Container ship at port / at sea, aerial', kind: 'stock', query: 'container ship aerial', picks: [
    {label: 'Pexels: Aerial view of vibrant container ship at port (4K)', url: 'https://www.pexels.com/video/aerial-view-of-vibrant-container-ship-at-port-30523150/'},
    {label: 'Pexels: Aerial view of busy container port operations', url: 'https://www.pexels.com/video/aerial-view-of-busy-container-port-operations-32747078/'}]},
  'kunming-market': {what: 'Wholesale fruit market in Kunming / Yunnan', kind: 'commons', query: 'wholesale fruit market'},
  'supermarket-durian': {what: 'Packaged durian pods in a supermarket fridge', kind: 'stock', query: 'supermarket fruit'},
  'ai-packing-line': {what: 'AI visual: packing house, durians moving down a line, dipped and boxed. NEVER show dyed flesh', kind: 'ai', query: 'fruit packing line'},
  'turmeric': {what: 'Turmeric powder / roots', kind: 'stock', query: 'turmeric', picks: [
    {label: 'Pexels search: turmeric videos', url: 'https://www.pexels.com/search/videos/turmeric/'}]},
  'ai-customs-lab': {what: 'AI visual: customs lab, test tubes, red REJECTED stamp (stamp is drawn by the video)', kind: 'ai', query: 'laboratory test tubes', picks: [
    {label: 'Pexels: A scientist looking at test tubes in a lab', url: 'https://www.pexels.com/video/a-scientist-looking-at-test-tubes-in-a-lab-8533503/'}]},
  'vietnam-port-trucks': {what: 'Queue of trucks at a border crossing / port gate', kind: 'stock', query: 'trucks queue border'},
  'lab-testing': {what: 'Lab technician running tests', kind: 'stock', query: 'laboratory test', picks: [
    {label: 'Pexels: Scientists working in a lab', url: 'https://www.pexels.com/video/scientists-working-in-a-lab-8852423/'}]},
  'timelapse-growth': {what: 'Time-lapse: saplings growing', kind: 'stock', query: 'plant growing timelapse', picks: [
    {label: 'Pexels: Time lapse of seedlings', url: 'https://www.pexels.com/video/time-lapse-of-seedlings-8522207/'}]},
  'ai-livestream': {what: 'AI visual: a livestream sale on a phone, a price tag slashed (no real politician faces)', kind: 'ai', query: 'livestream selling'},
  'hainan-island': {what: 'Beat of silence, then: a tropical island from the air', kind: 'commons', query: 'hainan island', picks: [
    {label: 'Commons: Haitang Bay in Sanya (aerial)', url: 'https://commons.wikimedia.org/wiki/File:Haitang_Bay_in_Sanya.jpg'},
    {label: 'Commons: Category "Sanya Bay"', url: 'https://commons.wikimedia.org/wiki/Category:Sanya_Bay'}]},
  'hainan-orchard': {what: 'Tropical orchard on Hainan (or generic young orchard)', kind: 'stock', query: 'tropical orchard'},
  'lan-farm-dusk': {what: "Back to Lan's farm at dusk: durian on one side, coffee on the other", kind: 'stock', query: 'farm sunset trees'},
  'coffee-and-durian': {what: 'Coffee plants and durian trees side by side', kind: 'stock', query: 'coffee plantation'},
  'border-trucks': {what: 'Queue of trucks at a border crossing or port gate', kind: 'stock', query: 'trucks queue border'},
  'malaysia-durian': {what: 'Musang King durians (Malaysia)', kind: 'commons', query: 'durian', picks: [{label: 'Commons: Category Musang King', url: 'https://commons.wikimedia.org/wiki/Category:Musang_King'}]},
  'rubber-plantation': {what: 'Rubber trees in rows, or latex tapping', kind: 'stock', query: 'rubber plantation'},
  'price-board': {what: 'Hand-written price signs at a fruit stall', kind: 'stock', query: 'market price sign'},
  'socks-factory': {what: 'Sock knitting machines (next-video teaser)', kind: 'stock', query: 'textile factory', picks: [
    {label: 'Pexels: Machines in textile factory', url: 'https://www.pexels.com/video/machines-in-textile-factory-10628544/'}]},
};
