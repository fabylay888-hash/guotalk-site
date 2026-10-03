import React from 'react';
import {AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import shorts from './shorts.json';
import {MARKER, SANS, TYPE} from './theme';

// Vertical 9:16 cut-down for TikTok / Reels: hook on top, the 16:9 video in the middle,
// word-by-word captions below, then a 6-second "full documentary on YouTube" end card.
type Plan = {id: string; part: number; of: number; dur: number; hook: string[]; words: [string, number][]};
export const CTA_SEC = 6;
export const shortFrames = (id: string) => Math.round(((shorts as unknown as Plan[]).find((s) => s.id === id)!.dur + CTA_SEC) * 30);
const stroke = (w: number) => ({WebkitTextStroke: `${w}px #000`, paintOrder: 'stroke fill' as const});

// Caption chunks: up to 3 words, always breaking after punctuation so sentences never mix.
const chunksOf = (words: [string, number][]) => {
  const out: number[][] = [];
  let cur: number[] = [];
  words.forEach(([w], i) => {
    cur.push(i);
    if (cur.length === 3 || /[.,?!:;"”]$/.test(w)) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
};

const Captions: React.FC<{words: [string, number][]}> = ({words}) => {
  const t = useCurrentFrame() / 30;
  const chunks = React.useMemo(() => chunksOf(words), [words]);
  const i = words.findIndex(([, s], k) => s <= t && (k === words.length - 1 || words[k + 1][1] > t));
  if (i < 0) return null;
  const chunk = chunks.find((c) => c.includes(i))!;
  return (
    <div style={{position: 'absolute', left: 40, right: 40, top: 1290, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: 30, rowGap: 6, lineHeight: 1.1}}>
      {chunk.map((k) => (
        <span key={k} style={{fontFamily: SANS, fontWeight: 900, fontSize: 92, color: k === i ? '#FFD23F' : '#fff', textTransform: 'uppercase', ...stroke(14), display: 'inline-block', transform: k === i ? 'scale(1.08)' : 'none'}}>{words[k][0]}</span>
      ))}
    </div>
  );
};

const Main: React.FC<{p: Plan}> = ({p}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const hookIn = spring({frame, fps, config: {damping: 14}});
  const src = staticFile(`shorts/${p.id}.mp4`);
  return (
    <AbsoluteFill style={{background: '#0B0606'}}>
      <OffthreadVideo src={src} muted style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', filter: 'blur(40px) brightness(0.35)', transform: 'scale(1.2)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, top: 140, textAlign: 'center', fontFamily: TYPE, fontSize: 34, letterSpacing: 10, color: '#E8BE6E'}}>GUOTALK · {p.part}/{p.of}</div>
      <div style={{position: 'absolute', left: 50, right: 50, top: 220, textAlign: 'center', transform: `scale(${0.85 + 0.15 * hookIn})`, opacity: hookIn}}>
        {p.hook[0] ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 80, lineHeight: 1.05, color: '#fff', ...stroke(12)}}>{p.hook[0]}</div> : null}
        {p.hook[1] ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 1, color: '#FFD23F', letterSpacing: -4, ...stroke(16)}}>{p.hook[1]}</div> : null}
        {p.hook[2] ? <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 80, lineHeight: 1.05, color: '#fff', ...stroke(12)}}>{p.hook[2]}</div> : null}
      </div>
      <OffthreadVideo src={src} style={{position: 'absolute', left: 0, top: 640, width: 1080, height: 608, boxShadow: '0 20px 60px rgba(0,0,0,0.6)'}} />
      <Captions words={p.words} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 14}});
  const b = spring({frame: frame - 12, fps, config: {damping: 12}});
  const bob = Math.sin(frame / 6) * 10;
  return (
    <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 40%, #3A1210 0%, #0B0606 75%)'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 230, textAlign: 'center', opacity: a}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, color: '#fff', lineHeight: 1.05, ...stroke(12)}}>FULL DOCUMENTARY</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, color: '#FFD23F', lineHeight: 1.05, ...stroke(12)}}>ON YOUTUBE</div>
      </div>
      <div style={{position: 'absolute', left: 90, top: 560, width: 900, transform: `scale(${0.7 + 0.3 * b}) rotate(${-2 * b}deg)`, opacity: b}}>
        <div style={{background: '#fff', padding: 14, boxShadow: '0 30px 60px rgba(0,0,0,0.6)'}}>
          <Img src={staticFile('thumb/youtube-thumb.jpg')} style={{width: '100%', display: 'block'}} />
        </div>
        <div style={{position: 'absolute', left: '50%', top: '50%', width: 150, height: 106, marginLeft: -75, marginTop: -53, background: '#FF0033', borderRadius: 28, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 0, height: 0, borderLeft: '46px solid #fff', borderTop: '28px solid transparent', borderBottom: '28px solid transparent', marginLeft: 10}} />
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1150, textAlign: 'center', opacity: b}}>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 110, color: '#fff', letterSpacing: -2}}>GuoTalk</div>
        <div style={{fontFamily: MARKER, fontSize: 70, color: '#FFD23F', marginTop: 20, transform: `translateY(${bob}px)`}}>link in bio ↑</div>
      </div>
    </AbsoluteFill>
  );
};

export const Short: React.FC<{id: string}> = ({id}) => {
  const p = (shorts as unknown as Plan[]).find((s) => s.id === id)!;
  const main = Math.round(p.dur * 30);
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={main}><Main p={p} /></Sequence>
      <Sequence from={main}>
        <EndCard />
        <Sequence from={8}><Audio src={staticFile('shorts/cta.mp3')} /></Sequence>
        <Audio src={staticFile('sfx/chapter.mp3')} volume={0.5} />
        <Audio src={staticFile('music/07-close.mp3')} startFrom={30 * 50} volume={(f) => 0.14 * interpolate(f, [0, 15, CTA_SEC * 30 - 30, CTA_SEC * 30], [0, 1, 1, 0], {extrapolateRight: 'clamp'})} />
      </Sequence>
    </AbsoluteFill>
  );
};
