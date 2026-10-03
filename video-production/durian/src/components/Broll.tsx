import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import available from '../available.json';
import {C} from '../theme';

const AVAIL = available as Record<string, string>;
export const pickBroll = (ids?: string[]) => ids?.find((id) => AVAIL[id]);

// Footage or still for a beat. Stills get a slow Ken Burns push; everything gets a
// light documentary grade (warm, slightly lifted blacks).
export const Broll: React.FC<{id: string; durationInFrames: number; seed: number}> = ({id, durationInFrames, seed}) => {
  const frame = useCurrentFrame();
  const file = AVAIL[id];
  const t = frame / Math.max(1, durationInFrames);
  const dir = seed % 2 === 0 ? 1 : -1;
  const scale = interpolate(t, [0, 1], [1.05, 1.16]);
  const x = interpolate(t, [0, 1], [0, 34 * dir]);
  const fade = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const grade = 'contrast(1.06) saturate(0.92) sepia(0.12)';
  const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(file);
  return (
    <AbsoluteFill style={{opacity: fade, overflow: 'hidden', background: C.bg}}>
      {isVideo ? (
        <OffthreadVideo src={staticFile(`broll/${file}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover', filter: grade}} />
      ) : (
        <Img src={staticFile(`broll/${file}`)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${x}px)`, filter: grade}} />
      )}
    </AbsoluteFill>
  );
};

