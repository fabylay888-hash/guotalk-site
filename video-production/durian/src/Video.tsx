import React from 'react';
import {AbsoluteFill, Audio, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from './timings.json';
import {SCENES, type Overlay} from './scenes';
import {Broll, pickBroll} from './components/Broll';
import {FULL_FRAME, OverlayView, SourceTag} from './components/Overlays';
import {Grain, Paper} from './components/Paper';
import {buildTimeline} from './timeline';
import {C, FPS, MARKER, SANS, TYPE} from './theme';

// Sound effects keyed to what appears on screen: [file in public/sfx, frame offset, volume].
type Cue = [string, number, number];
const cuesFor = (o: Overlay | undefined, len: number, at = 0): Cue[] => {
  if (!o) return [];
  switch (o.type) {
    case 'seq': return o.parts.flatMap((p, k) => cuesFor(p, Math.round(len * ((o.at[k + 1] ?? 1) - o.at[k])), at + Math.round(len * o.at[k])));
    case 'doc': return o.stamp ? [['stamp', at + 14 + o.fields.length * 16 + 6, 0.55]] : [];
    case 'depart': return [['flap', at + 4, 0.35]];
    case 'receipt': return [['receipt', at + 6, 0.35]];
    case 'tag': case 'statover': case 'growth': case 'tonnage': return [['pop', at + 8, 0.3]];
    case 'mapdive': return [['riser', at + Math.round(len * o.at) - 26, 0.35]];
    default: return [];
  }
};
const Sfx: React.FC<{cues: Cue[]}> = ({cues}) => (
  <>
    {cues.filter(([, f]) => f >= 0).map(([n, f, v], k) => (
      <Sequence key={k} from={f} durationInFrames={75} layout="none">
        <Audio src={staticFile(`sfx/${n}.mp3`)} volume={v} />
      </Sequence>
    ))}
  </>
);

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
        // Start each beat 10 frames early so it dissolves over the previous one.
        const xf = i > 0 && beat.tr !== 'whip' ? 10 : 0;
        const len = Math.max(1, to - from + xf);
        const full = beat.overlay && FULL_FRAME.has(beat.overlay.type);
        const clip = full ? undefined : pickBroll(beat.broll);
        const onPaper = !clip;
        return (
          <Sequence key={i} from={from - xf} durationInFrames={len} name={`${id} ¶${i + 1}: ${clip ?? beat.overlay?.type ?? 'paper'}`}>
            <BeatIn tr={beat.tr}>
              {clip ? <Broll id={clip} durationInFrames={len} seed={i + id.length} /> : full ? null : <Paper />}
              {beat.overlay ? <OverlayView o={beat.overlay} dur={len} onPaper={onPaper} /> : null}
            </BeatIn>
            {beat.source ? <SourceTag text={beat.source} onPaper={onPaper} /> : null}
            {beat.tr === 'burn' ? <FilmBurn /> : null}
            <Sfx cues={[...(beat.tr === 'whip' ? [['whoosh', 0, 0.35] as Cue] : []), ...(beat.tr === 'burn' ? [['burn', 0, 0.4] as Cue] : []), ...cuesFor(beat.overlay, len)]} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Whip pan: the new beat slides in fast with motion blur.
const BeatIn: React.FC<{tr?: 'whip' | 'burn'; children: React.ReactNode}> = ({tr, children}) => {
  const frame = useCurrentFrame();
  if (tr !== 'whip') {
    const o = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
    return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
  }
  const t = interpolate(frame, [0, 8], [1, 0], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  return <AbsoluteFill style={{transform: `translateX(${t * 70}%)`, filter: t > 0.01 ? `blur(${t * 24}px)` : undefined}}>{children}</AbsoluteFill>;
};

// Film burn: a warm light-leak flash for big reveals.
const FilmBurn: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 3, 14], [0.95, 0.8, 0], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen', opacity: o, background: 'radial-gradient(ellipse at 70% 30%, #fff6d8 0%, #ffb347 30%, #e2482b 60%, transparent 85%)'}} />;
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
  // Paper tear: the card rises in behind a jagged torn edge.
  const rise = interpolate(frame, [0, 12], [100, -6], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const teeth = Array.from({length: 25}, (_, k) => `${k * 4.17}% ${rise + (k % 2 ? 3 : 0) + ((k * 37) % 5) * 0.6}%`).join(', ');
  return (
    <AbsoluteFill style={{opacity: out, clipPath: `polygon(${teeth}, 100% 100%, 0% 100%)`, background: C.bg}}>
      {/* Original still for each chapter, slow push-in behind the title. */}
      <Img src={staticFile(`chapters/bg-${String(num).padStart(2, '0')}.jpg`)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${1.04 + 0.06 * (frame / durationInFrames)})`, filter: 'saturate(0.9) contrast(1.05)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,5,5,0.82) 0%, rgba(8,5,5,0.55) 45%, rgba(8,5,5,0.05) 80%)'}} />
      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 170}}>
        <div style={{fontFamily: TYPE, fontSize: 40, letterSpacing: 6, color: C.gold, opacity: p}}>{num === 7 ? 'CLOSE' : `CHAPTER ${num}`}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: '#FFF8EC', letterSpacing: -5, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, marginTop: 10, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>{title}</div>
        <div style={{width: 420 * p, height: 12, background: C.marker, marginTop: 14, borderRadius: 6, transform: 'rotate(-0.8deg)'}} />
      </AbsoluteFill>
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

// One score cue per chapter: it starts with the chapter card (or the title) and fades out as the chapter ends.
const MUSIC_VOL = 0.16;
const music = (segs: ReturnType<typeof buildTimeline>['segs']) => {
  const out: {id: string; from: number; dur: number}[] = [];
  segs.forEach((s, i) => {
    if (s.kind !== 'chapter') return;
    const prev = segs[i - 1];
    const from = prev && (prev.kind === 'chapterCard' || prev.kind === 'title') ? prev.from : s.from;
    const next = segs[i + 1];
    const end = next && next.kind === 'end' ? next.from + next.dur : s.from + s.dur;
    out.push({id: s.id, from, dur: end - from});
  });
  return out;
};

export const DurianVideo: React.FC = () => {
  const {segs} = buildTimeline();
  return (
    <AbsoluteFill style={{background: C.bg}}>
      {segs.map((s, i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.dur} name={s.kind === 'chapter' ? s.id : s.kind}>
          {s.kind === 'title' && <><TitleCard /><Audio src={staticFile('sfx/riser.mp3')} volume={0.4} /></>}
          {s.kind === 'chapterCard' && <><ChapterCard num={s.num} title={s.title} /><Audio src={staticFile('sfx/chapter.mp3')} volume={0.6} /></>}
          {s.kind === 'chapter' && <Chapter id={s.id} dur={s.dur} />}
          {s.kind === 'end' && <EndCard />}
        </Sequence>
      ))}
      {music(segs).map((m) => (
        <Sequence key={m.id} from={m.from} durationInFrames={m.dur} name={`music ${m.id}`} layout="none">
          <Audio src={staticFile(`music/${m.id}.mp3`)} volume={(f) => MUSIC_VOL * interpolate(f, [0, 20, m.dur - 40, m.dur], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})} />
        </Sequence>
      ))}
      <Grain />
    </AbsoluteFill>
  );
};
