import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {MapScene, type MapSpec} from './components/MapScene';
import {C, MARKER, SANS} from './theme';

// YouTube thumbnails (rendered as stills at 1920x1080, exported at 1280x720).
const stroke = (w: number, col = '#000') => ({WebkitTextStroke: `${w}px ${col}`, paintOrder: 'stroke fill' as const});
const MAP: MapSpec = {
  from: {c: [106, 19], z: 1500},
  highlight: {China: 'red', Thailand: 'gold', Vietnam: 'gold', Malaysia: 'gold'},
  arrows: [
    {from: [101.0, 15.3], to: [109.5, 27.5], delay: -200, width: 16},
    {from: [106.6, 14.2], to: [109.5, 27.5], delay: -200, width: 16},
    {from: [102.2, 4.2], to: [109.5, 27.5], delay: -200, bend: 0.18, width: 16},
  ],
};

const A: React.FC = () => (
  <AbsoluteFill>
    <MapScene spec={MAP} dur={60} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.0) 100%)'}} />
    <Img src={staticFile('thumb/durian-cut.png')} style={{position: 'absolute', left: 1060, top: 230, width: 720, filter: 'drop-shadow(18px 24px 0 rgba(0,0,0,0.35))'}} />
    <div style={{position: 'absolute', left: 70, top: 90, fontFamily: SANS, fontWeight: 900, fontSize: 120, color: '#fff', letterSpacing: -3, ...stroke(16)}}>CHINA BUYS</div>
    <div style={{position: 'absolute', left: 50, top: 190, fontFamily: SANS, fontWeight: 900, fontSize: 420, lineHeight: 1, color: '#FFD23F', letterSpacing: -18, ...stroke(22)}}>90%</div>
  </AbsoluteFill>
);

const B: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 62% 50%, #E8352B 0%, #A3150F 55%, #4A0705 100%)'}}>
    <Img src={staticFile('thumb/durian-open-cut.png')} style={{position: 'absolute', left: 960, top: 200, width: 1000, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.5))'}} />
    <div style={{position: 'absolute', left: 70, top: 230}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 110, color: '#fff', letterSpacing: -2, ...stroke(14)}}>CHINA SPENT</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 380, lineHeight: 0.9, color: '#FFD23F', letterSpacing: -16, ...stroke(22)}}>$7.5B</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 120, color: '#fff', letterSpacing: -3, marginTop: 20, ...stroke(14)}}>ON ONE FRUIT</div>
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
