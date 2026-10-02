import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from './timings.json';
import {SCENES} from './scenes';
import {Broll} from './components/Broll';
import {OverlayView, SourceTag} from './components/Overlays';
import {buildTimeline} from './timeline';
import {C, FPS, SANS, SERIF} from './theme';

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
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, to - from)} name={`${id} ¶${i + 1}: ${beat.broll}`}>
            <Broll id={beat.broll} durationInFrames={to - from} seed={i + id.length} />
            {beat.overlay ? <OverlayView o={beat.overlay} /> : null}
            {beat.source ? <SourceTag text={beat.source} /> : null}
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
  const p2 = spring({frame: frame - 12, fps, config: {damping: 200}});
  return (
    <AbsoluteFill style={{background: C.bg, justifyContent: 'center', alignItems: 'center'}}>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: C.gold, opacity: p2, marginBottom: 30}}>GUOTALK</div>
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: C.bone, textAlign: 'center', lineHeight: 1.05, opacity: p, transform: `scale(${0.96 + 0.04 * p})`}}>
        China Buys <span style={{color: C.gold}}>90%</span>
        <br />
        of the World's Durian Exports
      </div>
    </AbsoluteFill>
  );
};

const ChapterCard: React.FC<{num: number; title: string}> = ({num, title}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  const out = interpolate(frame, [durationInFrames - 8, durationInFrames], [1, 0], {extrapolateLeft: 'clamp'});
  return (
    <AbsoluteFill style={{background: C.bg, justifyContent: 'center', paddingLeft: 160, opacity: out}}>
      <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 8, color: C.gold, opacity: p}}>{num === 7 ? 'CLOSE' : `CHAPTER ${num}`}</div>
      <div style={{width: 160 * p, height: 6, background: C.gold, margin: '26px 0'}} />
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 120, color: C.bone, opacity: p, transform: `translateX(${(1 - p) * -30}px)`}}>{title}</div>
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame, fps, config: {damping: 200}});
  // Leave the two right-hand boxes empty: YouTube end-screen elements go there.
  return (
    <AbsoluteFill style={{background: C.bg}}>
      <div style={{position: 'absolute', left: 140, top: 380, opacity: p}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 34, letterSpacing: 10, color: C.gold}}>GUOTALK</div>
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 92, color: C.bone, marginTop: 20, lineHeight: 1.1}}>
          Next: the town that
          <br />
          makes the world's socks
        </div>
      </div>
      {[0, 1].map((i) => (
        <div key={i} style={{position: 'absolute', right: 140, top: 200 + i * 360, width: 560, height: 315, border: `3px dashed ${C.muted}`, borderRadius: 16, opacity: 0.35 * p}} />
      ))}
    </AbsoluteFill>
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
      {/* Optional music bed: drop public/music.mp3 and uncomment.
      <Audio src={staticFile('music.mp3')} volume={0.08} loop /> */}
    </AbsoluteFill>
  );
};
