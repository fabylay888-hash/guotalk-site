import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from './timings.json';
import {SCENES} from './scenes';
import {Broll, pickBroll} from './components/Broll';
import {FULL_FRAME, OverlayView, SourceTag} from './components/Overlays';
import {Grain, Paper} from './components/Paper';
import {buildTimeline} from './timeline';
import {C, FPS, MARKER, SANS, TYPE} from './theme';

const Chapter: React.FC<{id: string; dur: number}> = ({id, dur}) => {
  const ch = timings.find((c) => c.id === id)!;
  const beats = SCENES[id];
  return (
    <AbsoluteFill>
      <Audio src={staticFile(`vo/${id}.mp3`)} />
      {ch.paras.map((p, i) => {
        const from = Math.round(p.start * FPS);
        const to = i + 1 < ch.paras.length ? Math.round(ch.paras[i + 1].start * FPS) : dur;
        const beat = beats[i];
        if (!beat) return null;
        const len = Math.max(1, to - from);
        const full = beat.overlay && FULL_FRAME.has(beat.overlay.type);
        const clip = full ? undefined : pickBroll(beat.broll);
        const onPaper = !clip;
        return (
          <Sequence key={i} from={from} durationInFrames={len} name={`${id} ¶${i + 1}: ${clip ?? beat.overlay?.type ?? 'paper'}`}>
            {clip ? <Broll id={clip} durationInFrames={len} seed={i + id.length} /> : full ? null : <Paper />}
            {beat.overlay ? <OverlayView o={beat.overlay} dur={len} onPaper={onPaper} /> : null}
            {beat.source ? <SourceTag text={beat.source} onPaper={onPaper} /> : null}
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  const p2 = spring({frame: frame - 14, fps, config: {damping: 200}});
  const u = interpolate(frame, [24, 44], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Paper>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{fontFamily: TYPE, fontSize: 36, letterSpacing: 8, color: C.inkSoft, opacity: p2, marginBottom: 30}}>GUOTALK</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, color: C.ink, textAlign: 'center', lineHeight: 1.02, letterSpacing: -4, opacity: p, transform: `scale(${0.96 + 0.04 * p})`}}>
          China Buys <span style={{color: C.marker, position: 'relative'}}>90%<svg width={330} height={40} style={{position: 'absolute', left: -10, bottom: -26}}><path d="M5 25 C 90 8, 220 8, 320 22" stroke={C.marker} strokeWidth={9} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - u} /></svg></span>
          <br />
          of the World's Durian Exports
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

const ChapterCard: React.FC<{num: number; title: string}> = ({num, title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: out}}>
      <Paper>
        <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 170}}>
          <div style={{fontFamily: TYPE, fontSize: 40, letterSpacing: 6, color: C.inkSoft, opacity: p}}>{num === 7 ? 'CLOSE' : `CHAPTER ${num}`}</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.ink, letterSpacing: -5, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, marginTop: 10}}>{title}</div>
          <div style={{width: 420 * p, height: 12, background: C.marker, marginTop: 14, borderRadius: 6, transform: 'rotate(-0.8deg)'}} />
        </AbsoluteFill>
      </Paper>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  // The two right-hand boxes stay empty: YouTube end-screen elements go there.
  return (
    <Paper>
      <div style={{position: 'absolute', left: 140, top: 380, opacity: p}}>
        <div style={{fontFamily: TYPE, fontSize: 36, letterSpacing: 8, color: C.inkSoft}}>GUOTALK</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 92, color: C.ink, marginTop: 20, lineHeight: 1.08, letterSpacing: -3}}>
          Next: the town that
          <br />
          makes the world's socks
        </div>
        <div style={{fontFamily: MARKER, fontSize: 50, color: C.marker, marginTop: 30, transform: 'rotate(-2deg)'}}>subscribe →</div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', right: 140, top: 200 + i * 360, width: 560, height: 315, border: `3px dashed ${C.inkSoft}`, borderRadius: 16, opacity: 0.35 * p}} />
      ))}
    </Paper>
  );
};

export const DurianVideo: React.FC = () => {
  const {segs} = buildTimeline();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {segs.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur} name={s.kind === 'chapter' ? s.id : s.kind}>
          {s.kind === 'title' && <TitleCard />}
          {s.kind === 'chapterCard' && <ChapterCard num={s.num} title={s.title} />}
          {s.kind === 'chapter' && <Chapter id={s.id} dur={s.dur} />}
          {s.kind === 'end' && <EndCard />}
        </Sequence>
      ))}
      <Grain />
      {/* Optional music bed: drop public/music.mp3 and uncomment.
      <Audio src={staticFile('music.mp3')} volume={0.08} loop /> */}
    </AbsoluteFill>
  );
};
