import {continueRender, delayRender, staticFile} from 'remotion';

// GuoTalk brand palette (matches guotalk-site CSS variables)
export const C = {
  bg: '#080505',
  gold: '#E8BE6E',
  goldDeep: '#C79A48',
  red: '#E4482B',
  bone: '#F3EADA',
  muted: '#9C8F7E',
  green: '#7FA65A',
  // Johnny-Harris-style paper palette (graphics scenes)
  paper: '#EFE6D2',
  ink: '#1B1410',
  inkSoft: '#5C5246',
  sea: '#C9D3CF',
  land: '#F4EDDD',
  border: '#9C8F7E',
  marker: '#D7332A',
  highlighter: 'rgba(255, 214, 64, 0.75)',
};

export const SERIF = 'GT-Fraunces, Georgia, serif';
export const SANS = 'GT-Inter, "DejaVu Sans", Arial, sans-serif';
export const CJK = 'GT-NotoSC, "WenQuanYi Zen Hei", sans-serif';
export const MARKER = 'GT-Marker, "Comic Sans MS", cursive';
export const HAND = 'GT-Caveat, cursive';
export const TYPE = 'GT-Typewriter, "Courier New", monospace';
export const FPS = 30;

// Fonts are bundled in public/fonts so rendering never depends on a font CDN.
const FONTS: [string, string, string][] = [
  ['GT-Fraunces', 'Fraunces-600.woff2', '600'],
  ['GT-Fraunces', 'Fraunces-800.woff2', '800'],
  ['GT-Inter', 'Inter-400.woff2', '400'],
  ['GT-Inter', 'Inter-600.woff2', '600'],
  ['GT-Inter', 'Inter-800.woff2', '800'],
  ['GT-NotoSC', 'NotoSansSC-700-subset.woff2', '700'],
  ['GT-Marker', 'PermanentMarker.woff2', '400'],
  ['GT-Caveat', 'Caveat-700.woff2', '700'],
  ['GT-Typewriter', 'SpecialElite.woff2', '400'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('Loading fonts');
  Promise.all(
    FONTS.map(([family, file, weight]) => new FontFace(family, `url(${staticFile(`fonts/${file}`)})`, {weight}).load().then((f) => document.fonts.add(f))),
  ).then(() => continueRender(handle));
}
