import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C} from '../theme';

// Paper stock: warm base, fibre texture and soft vignette. With overlayOnly it only
// adds the texture on top of something else (maps), so everything shares one look.
export const Paper: React.FC<{overlayOnly?: boolean; children?: React.ReactNode}> = ({overlayOnly, children}) => (
  <AbsoluteFill style={{background: overlayOnly ? undefined : C.paper}}>
    {children}
    <svg width={1920} height={1080} style={{position: 'absolute', mixBlendMode: 'multiply', opacity: overlayOnly ? 0.35 : 0.55, pointerEvents: 'none'}}>
      <filter id="fibres">
        <feTurbulence type="fractalNoise" baseFrequency="0.9 0.25" numOctaves={3} seed={7} />
        <feColorMatrix values="0 0 0 0 0.45  0 0 0 0 0.38  0 0 0 0 0.28  0 0 0 0.35 0" />
      </filter>
      <rect width="1920" height="1080" filter="url(#fibres)" />
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(60,40,20,0.28) 100%)', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

// Film grain over the whole video: 6 pre-rendered noise frames cycled every 2 frames.
export const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const i = Math.floor(frame / 2) % 6;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: 0.22}}>
      <Img src={staticFile(`fx/grain${i}.png`)} style={{width: '100%', height: '100%', imageRendering: 'pixelated'}} />
    </AbsoluteFill>
  );
};
