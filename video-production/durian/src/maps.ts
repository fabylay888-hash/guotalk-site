import type {MapSpec} from './components/MapScene';

// Map shots ([lon, lat]; z = zoom in pixels per radian). Real borders from Natural Earth
// (world-atlas). Routes are simplified lines through the real stations/ports.
const TH: [number, number] = [101.0, 15.3];
const VN: [number, number] = [106.6, 14.2];
const MY: [number, number] = [102.2, 4.2];
const CN: [number, number] = [109.5, 27.5];
const SEA_CAM = {c: [107, 21] as [number, number], z: 1250};
const SEA_LABELS = [
  {at: [104, 34] as [number, number], text: 'China', size: 56},
  {at: [97.6, 17.4] as [number, number], text: 'Thailand', size: 30},
  {at: [111.2, 13.4] as [number, number], text: 'Vietnam', size: 30},
  {at: [97.5, 3.6] as [number, number], text: 'Malaysia', size: 30},
];

const RAIL: [number, number][] = [
  [100.5, 13.75], // Bangkok
  [102.0, 15.0],
  [102.74, 17.88], // Nong Khai
  [102.63, 17.97], // Vientiane
  [102.45, 18.92], // Vang Vieng
  [102.13, 19.88], // Luang Prabang
  [101.68, 21.18], // Boten (border)
  [100.8, 22.0], // Jinghong
  [100.97, 22.8], // Pu'er
  [102.54, 24.35], // Yuxi
  [102.71, 25.04], // Kunming
];
const SEA_ROUTE: [number, number][] = [
  [100.88, 13.08], // Laem Chabang
  [101.6, 11.0],
  [104.2, 8.0],
  [107.6, 9.6],
  [110.0, 13.5],
  [111.3, 17.5],
  [113.0, 20.6],
  [113.6, 22.6], // Pearl River Delta
];
export const CITIES: [number, number][] = [
  [116.4, 39.9], [121.5, 31.2], [113.3, 23.1], [114.1, 22.5], [104.1, 30.7], [106.5, 29.6], [114.3, 30.6], [108.9, 34.3],
  [120.2, 30.3], [118.8, 32.1], [113.0, 28.2], [113.6, 34.7], [106.7, 26.6], [108.3, 22.8], [119.3, 26.1], [118.1, 24.5],
  [117.3, 31.8], [115.9, 28.7], [117.0, 36.7], [120.4, 36.1], [117.2, 39.1], [114.5, 38.0], [112.5, 37.9], [103.8, 36.1],
  [110.3, 20.0], [123.4, 41.8], [126.6, 45.8], [125.3, 43.9], [111.7, 40.8], [121.6, 38.9], [101.8, 36.6],
];

export const MAPS: Record<string, MapSpec> = {
  highlands: {
    from: {c: [105, 17], z: 1700},
    to: {c: [108.3, 13.2], z: 8000},
    highlight: {Vietnam: 'gold'},
    labels: [{at: [108.5, 14.6], text: 'Central Highlands', size: 34, delay: 60}],
    pins: [{at: [108.04, 12.67], label: 'Đắk Lắk', delay: 70}],
    notes: [{text: 'coffee country', x: 1220, y: 300, delay: 90}],
    title: 'VIETNAM',
  },
  'china-glow': {
    from: {c: [108, 14], z: 5000},
    to: {c: [106, 24], z: 1150},
    highlight: {China: 'red', Vietnam: 'gold'},
    labels: [{at: [104, 34], text: 'China', size: 64, delay: 40, color: '#fff'}],
    notes: [{text: 'one buyer', x: 1180, y: 250, delay: 60, size: 64}],
  },
  'sea-to-china': {
    from: SEA_CAM,
    to: {c: [107, 21], z: 1350},
    highlight: {China: 'red', Thailand: 'gold', Vietnam: 'gold', Malaysia: 'gold'},
    labels: SEA_LABELS,
    arrows: [
      {from: TH, to: CN, delay: 10},
      {from: VN, to: CN, delay: 18},
      {from: MY, to: CN, delay: 26, bend: 0.18},
    ],
    notes: [{text: '~90% of\nworld durian exports', x: 1180, y: 700, delay: 50, size: 58}],
  },
  'durian-belt': {
    from: {c: [107, 22], z: 1050},
    to: {c: [107, 22], z: 1150},
    highlight: {China: 'red'},
    labels: SEA_LABELS.slice(0, 1),
    band: {lat1: -10, lat2: 18, label: 'the tropics'},
    notes: [{text: 'too cold, too windy', x: 1150, y: 180, delay: 40}],
  },
  'which-country': {
    from: SEA_CAM,
    highlight: {China: 'red'},
    labels: SEA_LABELS.slice(0, 1),
    notes: [{text: '?', x: 760, y: 560, delay: 20, size: 160}],
  },
  'thailand-only': {
    from: SEA_CAM,
    highlight: {China: 'red', Thailand: 'gold'},
    labels: SEA_LABELS.slice(0, 2),
    arrows: [{from: TH, to: CN, delay: 10, width: 12}],
    notes: [{text: '2021: almost 100%', x: 300, y: 820, delay: 40}],
  },
  'vietnam-opens': {
    from: SEA_CAM,
    highlight: {China: 'red', Thailand: 'gold', Vietnam: 'gold'},
    labels: SEA_LABELS.slice(0, 3),
    arrows: [{from: TH, to: CN, delay: -40, width: 12}, {from: VN, to: CN, delay: 14, width: 12}],
    notes: [{text: '2022: door opens', x: 1260, y: 760, delay: 36}],
  },
  malaysia: {
    from: {c: [104, 8], z: 2000},
    to: {c: [104, 4.5], z: 3000},
    highlight: {Malaysia: 'gold'},
    labels: [{at: [102.2, 4.3], text: 'Malaysia', size: 40}],
    notes: [{text: 'mangosteen now\npricier than some durians!', x: 1100, y: 640, delay: 40, size: 50}],
  },
  rail: {
    from: {c: [101.8, 19.2], z: 2700},
    to: {c: [101.8, 19.8], z: 3000},
    highlight: {China: 'red', Thailand: 'gold', Laos: 'dim'},
    labels: [{at: [104.6, 25.6], text: 'China', size: 44}, {at: [103.2, 20.2], text: 'Laos', size: 34}, {at: [100.0, 15.6], text: 'Thailand', size: 34}],
    routes: [{path: RAIL, delay: 10, dur: 120}],
    pins: [{at: [100.5, 13.75], label: 'Bangkok', delay: 6}, {at: [102.63, 17.97], label: 'Vientiane', delay: 60}, {at: [102.71, 25.04], label: 'Kunming', delay: 130}],
    notes: [{text: '26 hours', x: 1200, y: 640, delay: 140, size: 72}, {text: '→ 30+ cities in 48 h', x: 1180, y: 740, delay: 200}],
    title: 'CHINA–LAOS RAILWAY',
  },
  cities: {
    from: {c: [108, 31], z: 1100},
    highlight: {China: 'red'},
    pins: [{at: [102.71, 25.04], label: 'Kunming', delay: 0}],
    burst: {origin: [102.71, 25.04], cities: CITIES, delay: 12},
    notes: [{text: '30+ cities in 48 hours', x: 1180, y: 860, delay: 70}],
  },
  'sea-route': {
    from: {c: [106.5, 15], z: 1500},
    to: {c: [107, 16], z: 1650},
    highlight: {China: 'red', Thailand: 'gold'},
    labels: [{at: [104, 26], text: 'China', size: 50}, {at: [100.4, 16.6], text: 'Thailand', size: 32}],
    routes: [{path: SEA_ROUTE, delay: 10, dur: 110, color: '#1B1410'}],
    pins: [{at: [100.88, 13.08], label: 'Laem Chabang', delay: 4}, {at: [113.6, 22.6], label: 'Southern China', delay: 120}],
    notes: [{text: '4 days by sea', x: 1300, y: 560, delay: 120, size: 64}],
  },
  'thai-labs': {
    from: {c: [101, 14], z: 2600},
    to: {c: [101, 14], z: 2900},
    highlight: {Thailand: 'gold'},
    labels: [{at: [101, 15.5], text: 'Thailand', size: 44}],
    notes: [{text: '✓ own labs approved\n✗ artificial colour banned', x: 1150, y: 360, delay: 30, size: 52}],
  },
  'vietnam-warn': {
    from: {c: [106, 16], z: 2200},
    to: {c: [106.5, 15], z: 2600},
    highlight: {Vietnam: 'gold'},
    labels: [{at: [107.4, 16.4], text: 'Vietnam', size: 44}],
    notes: [{text: '⚠ oversupply', x: 1150, y: 380, delay: 26, size: 72}],
  },
  hainan: {
    from: {c: [108, 27], z: 1250},
    to: {c: [109.8, 19.3], z: 9500},
    highlight: {China: 'red'},
    labels: [{at: [109.8, 19.25], text: 'Hainan', size: 46, delay: 110, color: '#fff'}],
    notes: [{text: 'China grows its own', x: 1150, y: 200, delay: 140}],
  },
  'hainan-close': {
    from: {c: [109.8, 19.2], z: 9500},
    to: {c: [109.8, 19.2], z: 10500},
    highlight: {China: 'gold'},
    labels: [{at: [109.8, 19.25], text: 'Hainan', size: 46}],
    notes: [{text: '3,000+ hectares\nof durian', x: 1250, y: 220, delay: 20, size: 64}],
  },
  world: {
    from: {c: [108, 22], z: 1300},
    to: {c: [70, 22], z: 300},
    highlight: {China: 'red'},
    notes: [{text: 'one place → the world', x: 1100, y: 140, delay: 60, size: 60}],
  },
  zhuji: {
    from: {c: [106, 32], z: 1100},
    to: {c: [117.5, 29.5], z: 3000},
    highlight: {China: 'dim'},
    labels: [{at: [111, 33], text: 'China', size: 60}],
    pins: [{at: [120.2, 29.71], label: 'Datang, Zhejiang', delay: 100}],
    notes: [{text: 'next video →', x: 1300, y: 760, delay: 150, size: 64}],
  },
};
