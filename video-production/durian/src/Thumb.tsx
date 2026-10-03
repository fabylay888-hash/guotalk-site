import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {geoMercator, geoPath, type GeoPermissibleObjects} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {C, MARKER, SANS} from './theme';

// YouTube thumbnails (rendered as stills at 1920x1080, exported at 1280x720).
const stroke = (w: number, col = '#000') => ({WebkitTextStroke: `${w}px ${col}`, paintOrder: 'stroke fill' as const});
// A: one idea. A giant red China on black, a huge durian sitting on it, 90% alone on the left.
const countries = (feature(world as never, (world as never as {objects: {countries: never}}).objects.countries) as unknown as {features: {properties: {name: string}}[]}).features;
const china = countries.filter((f) => f.properties.name === 'China' || f.properties.name === 'Taiwan');
const sea = countries.filter((f) => ['Vietnam', 'Thailand', 'Malaysia', 'Laos', 'Cambodia', 'Myanmar'].includes(f.properties.name));
const proj = geoMercator().fitExtent([[860, 40], [1900, 1000]], {type: 'FeatureCollection', features: china} as unknown as GeoPermissibleObjects);
const path = geoPath(proj);

const A: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 70% 45%, #2A1512 0%, #0B0606 70%)'}}>
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="28" /></filter>
      </defs>
      {sea.map((f, i) => <path key={i} d={path(f as unknown as GeoPermissibleObjects) ?? ''} fill="#3A2A1C" stroke="#5A4630" strokeWidth={3} />)}
      {china.map((f, i) => <path key={'g' + i} d={path(f as unknown as GeoPermissibleObjects) ?? ''} fill="#FF2E24" filter="url(#glow)" opacity={0.65} />)}
      {china.map((f, i) => <path key={i} d={path(f as unknown as GeoPermissibleObjects) ?? ''} fill="#E8261C" stroke="#FF8A7A" strokeWidth={5} />)}
    </svg>
    <Img src={staticFile('thumb/durian-cut.png')} style={{position: 'absolute', left: 1120, top: 210, width: 760, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))'}} />
    <div style={{position: 'absolute', left: 60, top: 150}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, color: '#fff', letterSpacing: -4, ...stroke(16)}}>CHINA BUYS</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 470, lineHeight: 0.92, color: '#FFD23F', letterSpacing: -22, ...stroke(24)}}>90%</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: -2, marginTop: 10, ...stroke(12)}}>OF DURIAN EXPORTS</div>
    </div>
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
