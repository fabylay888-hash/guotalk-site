import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import available from '../available.json';
import {C, SANS} from '../theme';
import {SHOTS} from '../shots';

// Renders public/broll/<id>.(mp4|mov|webm|jpg|jpeg|png|webp) if present, else a labelled placeholder.
export const Broll: React.FC<{id: string; durationInFrames: number; seed: number}> = ({id, durationInFrames, seed}) => {
  const frame = useCurrentFrame();
  const file = (available as Record<string, string>)[id];
  const t = frame / Math.max(1, durationInFrames);
  // Slow Ken Burns push on stills and placeholders; alternate direction per beat.
  const dir = seed % 2 === 0 ? 1 : -1;
  const scale = interpolate(t, [0, 1], [1.04, 1.14]);
  const x = interpolate(t, [0, 1], [0, 30 * dir]);
  const fade = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  if (file && /\.(mp4|mov|webm|m4v)$/i.test(file)) {
    return (
      <AbsoluteFill style={{opacity: fade}}>
        <OffthreadVideo src={staticFile(`broll/${file}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </AbsoluteFill>
    );
  }
  if (file) {
    return (
      <AbsoluteFill style={{opacity: fade, overflow: 'hidden'}}>
        <Img src={staticFile(`broll/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`}} />
        {id.startsWith('ai-') ? <AiTag /> : null}
      </AbsoluteFill>
    );
  }
  const shot = SHOTS[id];
  const hue = (seed * 37) % 360;
  return (
    <AbsoluteFill style={{opacity: fade, background: C.bg, overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${x}px)`,
          background: `radial-gradient(ellipse at ${30 + 40 * t}% 40%, hsla(${hue},35%,22%,0.9), transparent 60%), radial-gradient(ellipse at 80% 90%, rgba(232,190,110,0.18), transparent 55%), linear-gradient(160deg, #1a120a, ${C.bg})`,
        }}
      />
      <div style={{position: 'absolute', left: 56, top: 48, fontFamily: SANS, color: C.muted, fontSize: 22, letterSpacing: 2, textTransform: 'uppercase'}}>
        <span style={{color: C.gold}}>▶ B-roll slot</span> · public/broll/{id}.mp4
        {shot ? <div style={{marginTop: 8, fontSize: 20, letterSpacing: 0, textTransform: 'none', maxWidth: 900, color: C.bone, opacity: 0.6}}>{shot.what}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// Synthetic imagery is labelled on screen (and should be disclosed in YouTube Studio).
const AiTag: React.FC = () => (
  <div style={{position: 'absolute', left: 48, top: 40, fontFamily: SANS, fontSize: 22, color: C.bone, background: 'rgba(8,5,5,0.55)', padding: '6px 14px', borderRadius: 6, opacity: 0.85}}>AI illustration</div>
);
