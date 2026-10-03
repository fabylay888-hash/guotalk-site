import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {MapScene, type MapSpec} from './components/MapScene';
import {C, MARKER, SANS} from './theme';

// YouTube thumbnails (rendered as stills at 1920x1080, exported at 1280x720).
const stroke = (w: number, col = '#000') => ({WebkitTextStroke: `${w}px ${col}`, paintOrder: 'stroke fill' as const});
const MAP: MapSpec = {
  from: {c: [103, 22], z: 1250},
  highlight: {China: 'red', Vietnam: 'gold', Thailand: 'gold', Malaysia: 'gold'},
};

// A: one idea only. China glowing red, one fat arrow from Southeast Asia, a huge 90%.
const A: React.FC = () => (
  <AbsoluteFill>
    <MapScene spec={MAP} dur={60} />
    <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 35%, rgba(255,60,40,0.25) 0%, rgba(0,0,0,0) 45%)'}} />
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <path d="M 980 900 C 1000 700, 1120 560, 1300 470" fill="none" stroke="#fff" strokeWidth={70} strokeLinecap="round" />
      <path d="M 980 900 C 1000 700, 1120 560, 1300 470" fill="none" stroke="#111" strokeWidth={46} strokeLinecap="round" />
      <path d="M 1400 420 L 1240 410 L 1330 560 Z" fill="#111" stroke="#fff" strokeWidth={12} strokeLinejoin="round" />
    </svg>
    <Img src={staticFile('thumb/durian-cut.png')} style={{position: 'absolute', left: 1310, top: 380, width: 560, filter: 'drop-shadow(18px 24px 0 rgba(0,0,0,0.4))'}} />
    <div style={{position: 'absolute', left: 60, top: 60, fontFamily: SANS, fontWeight: 900, fontSize: 150, color: '#fff', letterSpacing: -4, ...stroke(18)}}>CHINA BUYS</div>
    <div style={{position: 'absolute', left: 40, top: 200, fontFamily: SANS, fontWeight: 900, fontSize: 560, lineHeight: 1, color: '#FFD23F', letterSpacing: -26, ...stroke(26)}}>90%</div>
  </AbsoluteFill>
);

// B: a real reaction. Excited buyer holding the open fruit, money line on the left.
const B: React.FC = () => (
  <AbsoluteFill style={{background: '#A3150F'}}>
    <Img src={staticFile('thumb/b-woman-1.png')} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: 'translateX(230px) scale(1.04)', transformOrigin: '80% 50%'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(90,8,5,0.55) 0%, rgba(90,8,5,0.2) 40%, rgba(0,0,0,0) 55%)'}} />
    <div style={{position: 'absolute', left: 60, top: 170}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 120, color: '#fff', letterSpacing: -3, ...stroke(16)}}>CHINA SPENT</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 400, lineHeight: 0.9, color: '#FFD23F', letterSpacing: -18, ...stroke(24)}}>$7.5B</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, color: '#fff', letterSpacing: -3, marginTop: 24, ...stroke(16)}}>ON ONE FRUIT</div>
    </div>
  </AbsoluteFill>
);

const D: React.FC = () => (
  <AbsoluteFill>
    <Img src={staticFile('broll/ai-farmer-worried.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.15) contrast(1.1)'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.75) 100%)'}} />
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <path d="M 960 140 L 1200 360 L 1300 290 L 1480 480" fill="none" stroke="#FF2E24" strokeWidth={46} strokeLinejoin="round" strokeLinecap="round" />
      <path d="M 1545 555 L 1400 510 L 1510 390 Z" fill="#FF2E24" />
    </svg>
    <div style={{position: 'absolute', right: 70, top: 470, textAlign: 'right'}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: '#fff', letterSpacing: -8, ...stroke(18)}}>ONE</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 210, lineHeight: 0.95, color: '#FFD23F', letterSpacing: -8, ...stroke(18)}}>BUYER</div>
    </div>
    <div style={{position: 'absolute', left: 1080, top: 120, fontFamily: MARKER, fontSize: 90, color: '#fff', transform: 'rotate(-6deg)', ...stroke(10)}}>-50%</div>
  </AbsoluteFill>
);

export const Thumb: React.FC<{v: 'A' | 'B' | 'C'}> = ({v}) => (v === 'A' ? <A /> : v === 'B' ? <B /> : <D />);
