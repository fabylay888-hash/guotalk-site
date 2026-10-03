import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import available from '../available.json';
import {C, CJK, HAND, MARKER, SANS, TYPE} from '../theme';
import {Broll, pickBroll} from './Broll';
import {Paper} from './Paper';
import {MapScene, type MapSpec} from './MapScene';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const AVAIL = available as Record<string, string>;
const useIn = (delay = 0, len = 18) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: len});
};

// Footage (or still) filling a box; falls back to a paper panel when nothing is available.
const Media: React.FC<{ids?: string[]; dur: number; seed?: number}> = ({ids, dur, seed = 1}) => {
  const id = pickBroll(ids);
  return id ? <Broll id={id} durationInFrames={dur} seed={seed} /> : <Paper />;
};

/* ---------------- Durian icon + 100-durian grid ---------------- */
export const DurianIcon: React.FC<{size: number; color: string}> = ({size, color}) => {
  const pts: string[] = [];
  for (let k = 0; k < 28; k++) {
    const a = (k / 28) * Math.PI * 2;
    const r = k % 2 ? 0.36 : 0.44;
    pts.push(`${50 + Math.cos(a) * r * 92},${54 + Math.sin(a) * r * 108}`);
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 110">
      <path d="M50 8 L54 -2" stroke={C.ink} strokeWidth={5} strokeLinecap="round" />
      <polygon points={pts.join(' ')} fill={color} stroke={C.ink} strokeWidth={3} strokeLinejoin="round" />
    </svg>
  );
};

export const IconGrid: React.FC<{n: number; label: string; sub?: string; hitColor?: string; target?: string; big?: string; dur?: number}> = ({n, label, sub, hitColor = C.marker, target = 'CHINA', big, dur = 300}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const subIn = useIn(70);
  // After the flight: slow camera push, the box pulses, the big number counts up.
  const landed = 24 + n * 0.5 + 26;
  const push = interpolate(frame, [landed, dur], [1, 1.08], clamp);
  const pulse = 1 + 0.03 * Math.sin(Math.max(0, frame - landed) / 6) * Math.exp(-Math.max(0, frame - landed) / 90);
  const bigIn = useIn(landed + 4);
  const bigNum = Math.round(interpolate(frame, [landed + 4, landed + 34], [0, parseFloat((big ?? '0').replace(/[^\d.]/g, '')) || 0], {...clamp, easing: Easing.out(Easing.cubic)}));
  const cell = 64;
  const gx = 170;
  const gy = 190;
  const tx = 1420;
  const ty = 470;
  return (
    <Paper>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '60% 55%'}}>
      {Array.from({length: 100}).map((_, i) => {
        const col = i % 10;
        const row = Math.floor(i / 10);
        const hit = i < n;
        const start = 24 + i * 0.5;
        const fly = hit && target ? interpolate(frame, [start, start + 26], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}) : 0;
        const x0 = gx + col * cell;
        const y0 = gy + row * cell;
        // land in a loose pile inside the target box
        const x1 = tx + 40 + random(`x${i}`) * 300;
        const y1 = ty + 40 + random(`y${i}`) * 200;
        const tint = hit ? interpolate(frame, [start - 10, start], [0, 1], clamp) : 0;
        const pop = interpolate(frame, [i * 0.25, i * 0.25 + 8], [0, 1], clamp);
        return (
          <div key={i} style={{position: 'absolute', left: x0 + (x1 - x0) * fly, top: y0 + (y1 - y0) * fly, transform: `scale(${pop * (1 - 0.25 * fly)}) rotate(${fly * random(`r${i}`) * 90 + (hit ? 0 : Math.sin((frame + i * 7) / 8) * 6)}deg)`}}>
            <DurianIcon size={54} color={tint > 0.5 ? hitColor : '#9BA05A'} />
          </div>
        );
      })}
      {target ? (
        <div style={{position: 'absolute', left: tx, top: ty, width: 420, height: 300, border: `5px solid ${C.ink}`, borderTop: 'none', borderRadius: '0 0 20px 20px', opacity: p, transform: `scale(${pulse})`}}>
          <div style={{position: 'absolute', top: -70, left: 0, right: 0, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 56, color: C.ink, letterSpacing: 4}}>{target}</div>
        </div>
      ) : null}
      {big ? (
        <div style={{position: 'absolute', left: 220, top: 260, width: 760, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 280, color: hitColor, letterSpacing: -6, opacity: bigIn, transform: `scale(${0.8 + 0.2 * bigIn})`}}>
          {big.replace(/[\d.]+/, String(bigNum))}
        </div>
      ) : null}
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 170, top: 60, fontFamily: SANS, fontWeight: 800, fontSize: 66, color: C.ink, opacity: p, letterSpacing: -2}}>{label}</div>
      {sub ? <div style={{position: 'absolute', left: 170, bottom: 60, fontFamily: MARKER, fontSize: 46, color: C.marker, opacity: subIn, transform: 'rotate(-2deg)'}}>{sub}</div> : null}
    </Paper>
  );
};

/* ---------------- Thermal receipt ---------------- */
export const Receipt: React.FC<{title: string; lines: [string, string][]; total?: [string, string]; footer?: string; bg?: string[]; dur: number}> = ({title, lines, total, footer, bg, dur}) => {
  const frame = useCurrentFrame();
  const printed = interpolate(frame, [4, 70], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const all = [...lines, ...(total ? [['', ''] as [string, string], total] : [])];
  return (
    <AbsoluteFill>
      <Media ids={bg} dur={dur} />
      <AbsoluteFill style={{background: 'rgba(10,6,4,0.55)'}} />
      <div style={{position: 'absolute', left: '50%', top: 60, width: 640, transform: 'translateX(-50%) rotate(-1.5deg)', clipPath: `inset(0 0 ${100 - printed * 100}% 0)`}}>
        <div style={{background: '#FAF8F2', padding: '46px 48px 54px', fontFamily: TYPE, color: '#222', fontSize: 30, boxShadow: '0 20px 50px rgba(0,0,0,0.45)', maskImage: 'linear-gradient(transparent 0, black 6px)', backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.02) 0 2px, transparent 2px 4px)'}}>
          <div style={{textAlign: 'center', fontSize: 34, letterSpacing: 4, marginBottom: 6}}>{title}</div>
          <div style={{textAlign: 'center', fontSize: 22, opacity: 0.7, marginBottom: 20}}>{'*'.repeat(30)}</div>
          {all.map(([l, r], i) => {
            const isTotal = total && i === all.length - 1;
            return (
              <div key={i} style={{display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: isTotal ? 40 : 30, fontWeight: isTotal ? 700 : 400, margin: '8px 0', borderTop: isTotal ? '3px dashed #333' : undefined, paddingTop: isTotal ? 14 : 0}}>
                <span>{l}</span>
                <span>{r}</span>
              </div>
            );
          })}
          {footer ? <div style={{textAlign: 'center', fontSize: 22, marginTop: 24, opacity: 0.75}}>{footer}</div> : null}
          <div style={{height: 46, marginTop: 20, background: 'repeating-linear-gradient(90deg, #222 0 3px, transparent 3px 6px, #222 6px 7px, transparent 7px 11px)'}} />
        </div>
        <div style={{height: 22, background: 'linear-gradient(135deg, #FAF8F2 25%, transparent 25%) -11px 0/22px 22px, linear-gradient(225deg, #FAF8F2 25%, transparent 25%) -11px 0/22px 22px'}} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Swinging price tag over footage ---------------- */
export const PriceTag: React.FC<{price: string; label: string; old?: string; bg?: string[]; dur: number}> = ({price, label, old, bg, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const drop = spring({frame: frame - 4, fps, config: {damping: 9, stiffness: 120}});
  const swing = Math.sin(frame / 9) * 6 * Math.exp(-frame / 60);
  const slash = interpolate(frame, [26, 36], [0, 1], clamp);
  const newIn = useIn(old ? 38 : 10);
  const labelIn = useIn(44);
  return (
    <AbsoluteFill>
      <Media ids={bg} dur={dur} />
      <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(8,5,5,0.55), transparent 65%)'}} />
      <div style={{position: 'absolute', left: 300, top: -40, transformOrigin: '50% 0', transform: `translateY(${(drop - 1) * 500}px) rotate(${swing - 4}deg)`}}>
        <div style={{width: 4, height: 200, background: '#C8B48A', margin: '0 auto'}} />
        <div style={{width: 560, background: '#D9B97A', borderRadius: '30px 30px 16px 16px', padding: '60px 40px 50px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)', textAlign: 'center', position: 'relative'}}>
          <div style={{position: 'absolute', top: 18, left: '50%', width: 30, height: 30, marginLeft: -15, borderRadius: 15, background: 'rgba(40,25,10,0.6)'}} />
          {old ? (
            <div style={{position: 'relative', display: 'inline-block', fontFamily: MARKER, fontSize: 70, color: '#3a2a1a'}}>
              {old}
              <div style={{position: 'absolute', left: -14, right: -14, top: '50%', height: 10, background: C.marker, transform: `scaleX(${slash}) rotate(-9deg)`, transformOrigin: 'left'}} />
            </div>
          ) : null}
          <div style={{fontFamily: MARKER, fontSize: 110, color: C.marker, opacity: newIn, lineHeight: 1.1}}>{price}</div>
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, bottom: 90, fontFamily: TYPE, fontSize: 38, color: C.ink, background: C.paper, padding: '10px 22px', opacity: labelIn, transform: 'rotate(-1deg)'}}>{label}</div>
    </AbsoluteFill>
  );
};

/* ---------------- Clock / stopwatch card ---------------- */
export const Clock: React.FC<{mode: 'count' | 'shrink'; value: number; unit: string; from?: string; to?: string; label: string; bg?: string[]; dur: number}> = ({mode, value, unit, from, to, label, bg, dur}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [8, 70], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const spins = mode === 'count' ? Math.min(value, 4) : 3;
  const angle = t * 360 * spins;
  const p = useIn(0);
  const shownNum = mode === 'count' ? Math.round(t * value) : null;
  return (
    <AbsoluteFill>
      <Media ids={bg} dur={dur} />
      <AbsoluteFill style={{background: 'rgba(8,5,5,0.45)'}} />
      <div style={{position: 'absolute', right: 180, top: 170, width: 640, height: 640, opacity: p, transform: `scale(${0.9 + 0.1 * p})`}}>
        <svg width={640} height={640} viewBox="-320 -320 640 640">
          <circle r={300} fill={C.paper} stroke={C.ink} strokeWidth={14} />
          {Array.from({length: 60}).map((_, i) => (
            <line key={i} x1={0} y1={-280} x2={0} y2={i % 5 ? -266 : -246} stroke={C.ink} strokeWidth={i % 5 ? 3 : 8} transform={`rotate(${i * 6})`} />
          ))}
          <path d={`M0 0 L0 -270 A270 270 0 ${((angle % 360) + 360) % 360 > 180 ? 1 : 0} 1 ${270 * Math.sin((angle * Math.PI) / 180)} ${-270 * Math.cos((angle * Math.PI) / 180)} Z`} fill={C.marker} opacity={0.18} />
          <line x1={0} y1={30} x2={0} y2={-240} stroke={C.marker} strokeWidth={10} strokeLinecap="round" transform={`rotate(${angle})`} />
          <circle r={18} fill={C.ink} />
          <rect x={-40} y={-360} width={80} height={44} rx={8} fill={C.ink} />
        </svg>
        <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 88, color: C.ink}}>
          {mode === 'count' ? `${shownNum} ${unit}` : t < 0.5 ? from : to}
        </div>
      </div>
      <div style={{position: 'absolute', left: 120, top: 420, maxWidth: 820, fontFamily: SANS, fontWeight: 800, fontSize: 76, color: '#fff', lineHeight: 1.1, textShadow: '0 4px 20px rgba(0,0,0,0.6)', opacity: useIn(12)}}>{label}</div>
    </AbsoluteFill>
  );
};

/* ---------------- Split-flap departure board ---------------- */
const FLAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789:·-';
const FlapText: React.FC<{text: string; start: number; size: number; color: string}> = ({text, start, size, color}) => {
  const frame = useCurrentFrame();
  return (
    <span style={{display: 'inline-flex', gap: 4}}>
      {text.split('').map((ch, i) => {
        const settle = start + i * 1.5 + 10;
        const c = frame >= settle || ch === ' ' ? ch : FLAP[Math.floor(random(`${text}${i}${frame}`) * FLAP.length)];
        return (
          <span key={i} style={{width: size * 0.66, height: size * 1.25, background: '#1d1d1d', color, fontFamily: SANS, fontWeight: 800, fontSize: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4, boxShadow: 'inset 0 -2px 0 #000, inset 0 2px 0 #333', backgroundImage: 'linear-gradient(transparent 49%, #000 49%, #000 51%, transparent 51%)'}}>
            {c === ' ' ? '' : c}
          </span>
        );
      })}
    </span>
  );
};
export const DepartureBoard: React.FC<{title: string; rows: [string, string, string][]; footer?: string}> = ({title, rows, footer}) => {
  const footIn = useIn(60);
  return (
    <AbsoluteFill style={{background: '#0d0d0d', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{background: '#121212', padding: '50px 60px', borderRadius: 18, border: '6px solid #2a2a2a', boxShadow: '0 30px 80px rgba(0,0,0,0.8)'}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: '#F2C230', letterSpacing: 6, marginBottom: 30}}>{title}</div>
        {rows.map(([a, b, c], i) => (
          <div key={i} style={{display: 'flex', gap: 36, marginBottom: 18, alignItems: 'center'}}>
            <FlapText text={a} start={i * 8} size={46} color="#F2C230" />
            <FlapText text={b} start={i * 8 + 6} size={46} color="#f4f4f4" />
            <FlapText text={c} start={i * 8 + 12} size={46} color="#7CD67C" />
          </div>
        ))}
        {footer ? <div style={{fontFamily: TYPE, fontSize: 34, color: '#ddd', marginTop: 26, opacity: footIn}}>{footer}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Phone feed / livestream mockup ---------------- */
export const PhoneFeed: React.FC<{clips: string[]; counter: {label: string; value: number}; live?: boolean; caption: string; dur: number}> = ({clips, counter, live, caption, dur}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const have = clips.filter((c) => AVAIL[c]);
  // A real vertical clip (e.g. someone scrolling a phone) plays in its own frame instead of the drawn phone.
  const realVideo = have.find((c) => /\.(mp4|mov|webm)$/i.test(AVAIL[c]));
  const per = 34;
  const idx = Math.floor(frame / per);
  const within = (frame % per) / per;
  const slide = live ? 0 : interpolate(within, [0.82, 1], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const count = Math.round(interpolate(frame, [6, Math.min(dur - 10, 120)], [0, counter.value], {...clamp, easing: Easing.out(Easing.cubic)}));
  const W = 520;
  const H = 1000;
  const screen = (k: number) => {
    const id = have.length ? have[((k % have.length) + have.length) % have.length] : undefined;
    return id ? (
      <Img src={staticFile(`broll/${AVAIL[id]}`)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(1.1)'}} />
    ) : (
      <div style={{width: '100%', height: '100%', background: k % 2 ? '#2b241c' : '#3a2f22'}} />
    );
  };
  return (
    <AbsoluteFill>
      <Paper />
      {realVideo ? (
        <div style={{position: 'absolute', left: 280, top: 40, width: 560, height: 1000, borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 80px rgba(0,0,0,0.45)', transform: `translateY(${(1 - p) * 300}px) rotate(-2deg)`, border: `10px solid ${C.paper}`}}>
          <OffthreadVideo src={staticFile(`broll/${AVAIL[realVideo]}`)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          {Array.from({length: 8}).map((_, i) => {
            const t0 = (i * 17) % 120;
            const f = ((frame - t0) % 120) / 60;
            return f > 0 && f < 1 ? <div key={i} style={{position: 'absolute', right: 40 + Math.sin(f * 6 + i) * 30, bottom: 120 + f * 520, fontSize: 52, color: '#ff4d6d', opacity: 1 - f}}>♥</div> : null;
          })}
        </div>
      ) : (
      <div style={{position: 'absolute', left: 300, top: 40, width: W, height: H, borderRadius: 70, background: '#0b0b0b', padding: 18, boxShadow: '0 40px 80px rgba(0,0,0,0.45)', transform: `translateY(${(1 - p) * 300}px) rotate(-3deg)`}}>
        <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: 54, overflow: 'hidden', background: '#000'}}>
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${-slide * 100}%)`}}>{screen(live ? 0 : idx)}</div>
          <div style={{position: 'absolute', inset: 0, transform: `translateY(${(1 - slide) * 100}%)`}}>{screen(idx + 1)}</div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 300, background: 'linear-gradient(transparent, rgba(0,0,0,0.75))'}} />
          {live ? <div style={{position: 'absolute', left: 28, top: 40, background: '#E5342B', color: '#fff', fontFamily: SANS, fontWeight: 800, fontSize: 28, padding: '4px 14px', borderRadius: 8}}>LIVE</div> : null}
          <div style={{position: 'absolute', right: 26, bottom: 220, display: 'flex', flexDirection: 'column', gap: 34, alignItems: 'center', color: '#fff', fontFamily: SANS, fontWeight: 700, fontSize: 24}}>
            {['♥', '💬', '🛒'].map((g, i) => (
              <div key={i} style={{textAlign: 'center'}}>
                <div style={{fontSize: 54}}>{g}</div>
                {Math.round(count / (i + 3) / 1000)}k
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: 28, right: 120, bottom: 50, color: '#fff', fontFamily: CJK, fontSize: 30, lineHeight: 1.3}}>榴莲 · durian {live ? '· 特价' : ''}</div>
          {Array.from({length: 8}).map((_, i) => {
            const t0 = (i * 17) % 120;
            const f = ((frame - t0) % 120) / 60;
            return f > 0 && f < 1 ? <div key={i} style={{position: 'absolute', right: 60 + Math.sin(f * 6 + i) * 30, bottom: 300 + f * 420, fontSize: 40, opacity: 1 - f}}>♥</div> : null;
          })}
        </div>
      </div>
      )}
      <div style={{position: 'absolute', left: 980, top: 300, maxWidth: 800}}>
        <div style={{fontFamily: TYPE, fontSize: 40, color: C.inkSoft}}>{counter.label}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 150, color: C.ink, letterSpacing: -5, fontVariantNumeric: 'tabular-nums'}}>{count.toLocaleString('en-US')}</div>
        <div style={{fontFamily: MARKER, fontSize: 52, color: C.marker, marginTop: 20, transform: 'rotate(-2deg)', opacity: useIn(50)}}>{caption}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Investigation corkboard ---------------- */
export type BoardCard = {key: string; x: number; y: number; rot?: number; img?: string[]; title: string; text?: string; at: number; red?: boolean; w?: number};
export const Board: React.FC<{cards: BoardCard[]; strings: [string, string, number][]; focus?: [number, number]; dur: number}> = ({cards, strings, focus, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const push = interpolate(frame, [0, dur], [1, 1.12], clamp);
  const [fx, fy] = focus ?? [960, 540];
  const pin = (k: string) => {
    const c = cards.find((q) => q.key === k)!;
    return [c.x + (c.w ?? 300) / 2, c.y + 16] as const;
  };
  return (
    <AbsoluteFill style={{background: '#8B6A43', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: `${fx}px ${fy}px`}}>
        <svg width={1920} height={1080} style={{position: 'absolute', opacity: 0.55}}>
          <filter id="cork">
            <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves={3} seed={3} />
            <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.24  0 0 0 0 0.12  0 0 0 0.9 0" />
          </filter>
          <rect width="1920" height="1080" filter="url(#cork)" />
        </svg>
        {cards.map((c) => {
          const s = spring({frame: frame - c.at, fps, config: {damping: 14, stiffness: 160}});
          const id = pickBroll(c.img);
          return (
            <div key={c.key} style={{position: 'absolute', left: c.x, top: c.y, width: c.w ?? 300, transform: `rotate(${c.rot ?? 0}deg) scale(${0.6 + 0.4 * s})`, opacity: s, background: c.red ? '#FBE9E4' : '#FBF7EC', padding: id ? '14px 14px 18px' : '22px 20px', boxShadow: '0 12px 24px rgba(0,0,0,0.4)'}}>
              {id ? <Img src={staticFile(`broll/${AVAIL[id]}`)} style={{width: '100%', height: ((c.w ?? 300) * 2) / 3, objectFit: 'cover', filter: 'sepia(0.25) contrast(1.05)'}} /> : null}
              <div style={{fontFamily: MARKER, fontSize: (c.w ?? 300) > 400 ? 50 : 34, color: c.red ? C.marker : C.ink, marginTop: id ? 10 : 0, lineHeight: 1.05}}>{c.title}</div>
              {c.text ? <div style={{fontFamily: TYPE, fontSize: (c.w ?? 300) > 400 ? 30 : 22, color: C.inkSoft, marginTop: 6, lineHeight: 1.25}}>{c.text}</div> : null}
              <div style={{position: 'absolute', left: (c.w ?? 300) / 2 - 14, top: -10, width: 28, height: 28, borderRadius: 14, background: 'radial-gradient(circle at 35% 35%, #ff7b6b, #b3241a)', boxShadow: '0 3px 4px rgba(0,0,0,0.5)'}} />
            </div>
          );
        })}
        <svg width={1920} height={1080} style={{position: 'absolute', pointerEvents: 'none'}}>
          {strings.map(([a, b, at], i) => {
            const [x1, y1] = pin(a);
            const [x2, y2] = pin(b);
            const prog = interpolate(frame, [at, at + 16], [0, 1], clamp);
            const sag = Math.hypot(x2 - x1, y2 - y1) * 0.08;
            return <path key={i} d={`M${x1},${y1} Q${(x1 + x2) / 2},${(y1 + y2) / 2 + sag} ${x2},${y2}`} fill="none" stroke="#C1272D" strokeWidth={5} pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} style={{filter: 'drop-shadow(0 3px 2px rgba(0,0,0,0.4))'}} />;
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------------- Official form that fills in, then gets stamped ---------------- */
export const DocForm: React.FC<{header: string; fields: [string, string][]; stamp?: string; note?: string}> = ({header, fields, stamp, note}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useIn(0);
  const stampAt = 14 + fields.length * 16 + 8;
  const hit = spring({frame: frame - stampAt, fps, config: {damping: 11, stiffness: 200}});
  const noteIn = useIn(stampAt + 18);
  return (
    <Paper>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'relative', width: 1240, background: '#FCFAF4', padding: '60px 80px 70px', boxShadow: '0 18px 40px rgba(40,25,10,0.3)', transform: `rotate(1deg) translateY(${(1 - p) * 60}px)`, opacity: p}}>
          <div style={{fontFamily: TYPE, fontSize: 36, color: C.ink, borderBottom: `4px double ${C.ink}`, paddingBottom: 14, marginBottom: 26, display: 'flex', justifyContent: 'space-between'}}>
            <span>{header}</span>
            <span style={{fontSize: 26, opacity: 0.7}}>No. 2025-0110</span>
          </div>
          {fields.map(([k, v], i) => {
            const start = 14 + i * 16;
            const chars = Math.floor(interpolate(frame, [start, start + 14], [0, v.length], clamp));
            return (
              <div key={k} style={{display: 'flex', gap: 24, alignItems: 'baseline', margin: '16px 0', borderBottom: '2px dotted #b9ae98', paddingBottom: 8}}>
                <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 26, color: C.inkSoft, width: 300, textTransform: 'uppercase', letterSpacing: 2}}>{k}</div>
                <div style={{fontFamily: HAND, fontSize: 50, color: '#1F3A8A'}}>{v.slice(0, chars)}</div>
              </div>
            );
          })}
          {stamp ? (
            <div style={{position: 'absolute', right: -40, bottom: -50, border: `12px solid ${C.marker}`, color: C.marker, fontFamily: SANS, fontWeight: 800, fontSize: 110, letterSpacing: 10, padding: '0 34px', borderRadius: 14, transform: `rotate(-14deg) scale(${interpolate(hit, [0, 1], [2.6, 1])})`, opacity: hit * 0.88, mixBlendMode: 'multiply'}}>{stamp}</div>
          ) : null}
        </div>
        {note ? <div style={{position: 'absolute', bottom: 46, fontFamily: TYPE, fontSize: 34, color: C.ink, opacity: noteIn}}>{note}</div> : null}
      </AbsoluteFill>
    </Paper>
  );
};

/* ---------------- Split screen comparison ---------------- */
export const Split: React.FC<{left: {ids?: string[]; label: string; value: string}; right: {ids?: string[]; label: string; value: string}; title?: string; dur: number}> = ({left, right, title, dur}) => {
  const frame = useCurrentFrame();
  const wipe = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const side = (s: typeof left, i: number) => {
    const p = interpolate(frame, [16 + i * 12, 34 + i * 12], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
    return (
      <div style={{position: 'absolute', top: 0, bottom: 0, left: i ? 963 : 0, width: 957, overflow: 'hidden', clipPath: `inset(0 ${i ? 0 : (1 - wipe) * 100}% 0 ${i ? (1 - wipe) * 100 : 0}%)`}}>
        <AbsoluteFill>
          <Media ids={s.ids} dur={dur} seed={i} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: 'linear-gradient(transparent 40%, rgba(8,5,5,0.85))'}} />
        <div style={{position: 'absolute', left: 60, bottom: 80, opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
          <div style={{fontFamily: TYPE, fontSize: 40, color: C.bone}}>{s.label}</div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 130, color: i ? C.gold : '#fff', letterSpacing: -4}}>{s.value}</div>
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill style={{background: C.ink}}>
      {side(left, 0)}
      {side(right, 1)}
      <div style={{position: 'absolute', left: 957, top: 0, bottom: 0, width: 6, background: C.paper}} />
      <div style={{position: 'absolute', left: 960, top: 470, transform: 'translate(-50%,-50%)', width: 120, height: 120, borderRadius: 60, background: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MARKER, fontSize: 52, color: C.marker, opacity: wipe}}>vs</div>
      {title ? <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center'}}><span style={{fontFamily: TYPE, fontSize: 40, color: C.ink, background: C.paper, padding: '8px 24px'}}>{title}</span></div> : null}
    </AbsoluteFill>
  );
};

/* ---------------- Big number over real footage (lower third) ---------------- */
export const StatOver: React.FC<{value: string; label: string; sub?: string; ids?: string[]; dur: number; center?: boolean}> = ({value, label, sub, ids, dur, center}) => {
  const frame = useCurrentFrame();
  const bar = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const v = useIn(10);
  const l = useIn(20);
  const s = useIn(32);
  return (
    <AbsoluteFill>
      <Media ids={ids} dur={dur} />
      <AbsoluteFill style={{background: center ? 'radial-gradient(ellipse at center, rgba(8,5,5,0.6) 0%, rgba(8,5,5,0.35) 60%, rgba(8,5,5,0.55) 100%)' : 'linear-gradient(0deg, rgba(8,5,5,0.85) 0%, rgba(8,5,5,0.3) 45%, transparent 70%)'}} />
      <div style={center ? {position: 'absolute', left: 0, right: 0, top: '50%', transform: 'translateY(-50%)', textAlign: 'center'} : {position: 'absolute', left: 110, bottom: 110}}>
        <div style={{width: 260 * bar, height: 10, background: C.marker, marginBottom: 20, marginLeft: center ? 'auto' : 0, marginRight: center ? 'auto' : 0}} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: center ? 260 : 170, color: '#fff', letterSpacing: -6, lineHeight: 0.95, opacity: v, transform: `translateY(${(1 - v) * 30}px)`, textShadow: '0 6px 30px rgba(0,0,0,0.5)'}}>{value}</div>
        <div style={{display: 'inline-block', fontFamily: TYPE, fontSize: 42, color: C.ink, background: C.paper, padding: '8px 20px', marginTop: 18, opacity: l}}>{label}</div>
        {sub ? <div style={{fontFamily: MARKER, fontSize: 40, color: C.gold, marginTop: 16, opacity: s}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

/* ---------------- Map → footage dive (circle opens from the pin) ---------------- */
export const MapDive: React.FC<{spec: MapSpec; ids?: string[]; at: number; dur: number}> = ({spec, ids, at, dur}) => {
  const frame = useCurrentFrame();
  const start = Math.round(at * dur);
  // The circle grows from the screen centre (the camera ends centred on the pin).
  const r = interpolate(frame, [start, start + 18], [0, 1250], {...clamp, easing: Easing.in(Easing.cubic)});
  const zoom = interpolate(frame, [start, dur + 10], [1.35, 1.05], clamp);
  return (
    <AbsoluteFill>
      <MapScene spec={spec} dur={start + 6} />
      {frame >= start ? (
        <AbsoluteFill style={{clipPath: `circle(${r}px at 960px 540px)`}}>
          <AbsoluteFill style={{transform: `scale(${zoom})`}}>
            <Media ids={ids} dur={dur - start} />
          </AbsoluteFill>
        </AbsoluteFill>
      ) : null}
      {frame >= start && r < 1240 ? (
        <svg width={1920} height={1080} style={{position: 'absolute', pointerEvents: 'none'}}>
          <circle cx={960} cy={540} r={r} fill="none" stroke={C.paper} strokeWidth={10} />
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};

/* ---------------- Spending growth: small bar vs a tower that shoots up, ×N marker ---------------- */
export const Growth: React.FC<{fromLabel: string; toLabel: string; toValue: number; prefix: string; suffix: string; times: string; caption: string; ids?: string[]; dur: number}> = ({fromLabel, toLabel, toValue, prefix, suffix, times, caption, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ground = 930;
  const H = 760; // tower height
  const small = H / 12;
  const smallIn = spring({frame: frame - 4, fps, config: {damping: 200}});
  const grow = interpolate(frame, [22, 80], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const towerH = small + (H - small) * grow;
  const val = (toValue / 12) + (toValue - toValue / 12) * grow;
  const shake = grow > 0 && grow < 1 ? Math.sin(frame * 2.3) * 2 : 0;
  const mark = spring({frame: frame - 88, fps, config: {damping: 11, stiffness: 150}});
  const capIn = useIn(100);
  const push = interpolate(frame, [0, dur], [1, 1.06], clamp);
  return (
    <Paper>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '50% 70%'}}>
        <div style={{position: 'absolute', left: 160, right: 160, top: ground, height: 6, background: C.ink}} />
        {/* a decade earlier */}
        <div style={{position: 'absolute', left: 430, top: ground - small * smallIn, width: 240, height: small * smallIn, background: C.inkSoft}} />
        <div style={{position: 'absolute', left: 330, top: ground - small - 120, width: 440, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 64, color: C.inkSoft, opacity: smallIn}}>{prefix}{(toValue / 12).toFixed(1)}{suffix}</div>
        <div style={{position: 'absolute', left: 330, top: ground + 22, width: 440, textAlign: 'center', fontFamily: TYPE, fontSize: 36, color: C.ink}}>{fromLabel}</div>
        {/* last year */}
        <div style={{position: 'absolute', left: 1130 + shake, top: ground - towerH, width: 280, height: towerH, background: `repeating-linear-gradient(0deg, ${C.marker} 0 24px, #B8261F 24px 28px)`, boxShadow: '8px 8px 0 rgba(0,0,0,0.15)', borderRadius: '6px 6px 0 0'}} />
        <div style={{position: 'absolute', left: 1430, top: ground - towerH - 10, fontFamily: SANS, fontWeight: 800, fontSize: 112, color: C.ink, letterSpacing: -4, fontVariantNumeric: 'tabular-nums', opacity: grow > 0 ? 1 : 0}}>
          {prefix}{val.toFixed(1)}{suffix}
        </div>
        <div style={{position: 'absolute', left: 1050, top: ground + 22, width: 440, textAlign: 'center', fontFamily: TYPE, fontSize: 36, color: C.ink}}>{toLabel}</div>
        {/* ×12 marker */}
        <svg width={1920} height={1080} style={{position: 'absolute', opacity: mark}}>
          <path d={`M 690 ${ground - small - 10} C 850 ${ground - small - 60}, 950 ${ground - H + 40}, 1110 ${ground - H + 10}`} fill="none" stroke={C.marker} strokeWidth={8} strokeDasharray="18 12" strokeLinecap="round" />
          <path d={`M 1110 ${ground - H + 10} l -34 -8 M 1110 ${ground - H + 10} l -24 26`} stroke={C.marker} strokeWidth={8} strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', left: 700, top: ground - H * 0.62, fontFamily: MARKER, fontSize: 170, color: C.marker, transform: `rotate(-10deg) scale(${0.4 + 0.6 * mark})`, opacity: mark}}>{times}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', opacity: capIn}}>
        <span style={{fontFamily: TYPE, fontSize: 42, color: C.ink, borderBottom: `3px solid ${C.ink}`, paddingBottom: 6}}>{caption}</span>
      </div>
    </Paper>
  );
};

// Two freight trains pull into Kunming: last year's (7 wagons) and this year's (12, "almost double").
const Wagon: React.FC<{x: number; y: number; w: number; color: string; load: boolean; spin: number}> = ({x, y, w, color, load, spin}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: 110}}>
    {load && [0.2, 0.5, 0.8].map((p, i) => (
      <div key={i} style={{position: 'absolute', left: w * p - 24, top: -14 + (i % 2) * 6}}><DurianIcon size={48} color={C.gold} /></div>
    ))}
    <div style={{position: 'absolute', left: 0, top: 18, width: w, height: 62, background: color, border: `4px solid ${C.ink}`, borderRadius: 6, boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 8, right: 8, top: 22, height: 4, background: 'rgba(255,255,255,0.35)'}} />
    </div>
    {[0.24, 0.76].map((p, i) => (
      <svg key={i} width={34} height={34} viewBox="-17 -17 34 34" style={{position: 'absolute', left: w * p - 17, top: 76, transform: `rotate(${spin}deg)`}}>
        <circle r={14} fill={C.ink} /><circle r={5} fill={C.paper} /><path d="M -14 0 H 14 M 0 -14 V 14" stroke={C.paper} strokeWidth={2} />
      </svg>
    ))}
  </div>
);

const Train: React.FC<{y: number; n: number; color: string; off: number; label: string; dim?: boolean}> = ({y, n, color, off, label, dim}) => {
  const x0 = 210, W = 104, G = 10, L = 150;
  const spin = -off * 2.2;
  return (
    <>
      <div style={{position: 'absolute', left: 120, right: 60, top: y + 112, height: 6, background: C.ink, opacity: 0.85}} />
      {Array.from({length: 34}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: 130 + i * 52, top: y + 106, width: 10, height: 18, background: C.inkSoft, opacity: 0.5}} />
      ))}
      <div style={{position: 'absolute', left: 120, top: y - 70, fontFamily: TYPE, fontSize: 36, color: C.ink, opacity: dim ? 0.75 : 1}}>{label}</div>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${off}px)`, opacity: dim ? 0.8 : 1}}>
        {/* locomotive */}
        <div style={{position: 'absolute', left: x0, top: y + 4, width: L, height: 76, background: C.paper, border: `4px solid ${C.ink}`, borderRadius: '44px 8px 6px 6px', boxSizing: 'border-box', overflow: 'hidden'}}>
          <div style={{position: 'absolute', left: 0, right: 0, top: 40, height: 10, background: color}} />
          <div style={{position: 'absolute', left: 26, top: 12, width: 38, height: 20, background: C.ink, borderRadius: '14px 4px 4px 4px'}} />
        </div>
        {[0.3, 0.75].map((p, i) => (
          <svg key={i} width={34} height={34} viewBox="-17 -17 34 34" style={{position: 'absolute', left: x0 + L * p - 17, top: y + 76, transform: `rotate(${spin}deg)`}}>
            <circle r={14} fill={C.ink} /><circle r={5} fill={C.paper} /><path d="M -14 0 H 14 M 0 -14 V 14" stroke={C.paper} strokeWidth={2} />
          </svg>
        ))}
        {Array.from({length: n}).map((_, i) => (
          <Wagon key={i} x={x0 + L + G + i * (W + G)} y={y} w={W} color={color} load spin={spin} />
        ))}
      </div>
    </>
  );
};

export const RailTonnage: React.FC<{value: number; unit: string; caption: string; prevLabel: string; curLabel: string; times: string; note: string; dur: number}> = ({value, unit, caption, prevLabel, curLabel, times, note, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const in1 = interpolate(frame, [0, 36], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const in2 = interpolate(frame, [24, 112], [1, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const count = Math.round((value * (1 - in2)) / 100) * 100;
  const pop = spring({frame: frame - 112, fps, config: {damping: 9, stiffness: 160}});
  const mark = spring({frame: frame - 128, fps, config: {damping: 12, stiffness: 140}});
  const capIn = useIn(4);
  const push = interpolate(frame, [0, dur], [1, 1.05], clamp);
  const W = 104, G = 10, L = 150, x0 = 210;
  const end1 = x0 + L + G + 7 * (W + G) - G;
  const end2 = x0 + L + G + 12 * (W + G) - G;
  const y1 = 290, y2 = 560;
  return (
    <Paper>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: '30% 55%'}}>
        {/* Kunming station post */}
        <div style={{position: 'absolute', left: 60, top: 190, width: 14, height: 520, background: C.ink}} />
        <div style={{position: 'absolute', left: 30, top: 150, padding: '6px 14px', background: C.ink, color: C.paper, fontFamily: SANS, fontWeight: 800, fontSize: 30, letterSpacing: 2}}>
          <span style={{fontFamily: CJK, marginRight: 10}}>昆明</span>KUNMING
        </div>
        <Train y={y1} n={7} color={C.inkSoft} off={in1 * 1900} label={prevLabel} dim />
        <Train y={y2} n={12} color={C.marker} off={in2 * 1900} label={curLabel} />
        {/* almost-double bracket */}
        <svg width={1920} height={1080} style={{position: 'absolute', opacity: mark}}>
          <path d={`M ${end1} ${y1 + 130} V ${y2 + 150}`} stroke={C.ink} strokeWidth={4} strokeDasharray="12 10" />
          <path d={`M ${end2} ${y2 + 130} V ${y2 + 150}`} stroke={C.ink} strokeWidth={4} />
          <path d={`M ${end1} ${y2 + 150} H ${end1 + (end2 - end1) * mark}`} stroke={C.marker} strokeWidth={8} strokeLinecap="round" />
        </svg>
        <div style={{position: 'absolute', left: end1 + 30, top: y2 + 168, fontFamily: MARKER, fontSize: 92, color: C.marker, transform: `rotate(-6deg) scale(${0.4 + 0.6 * mark})`, transformOrigin: 'left top', opacity: mark}}>
          {times} <span style={{fontFamily: HAND, fontSize: 56, color: C.ink}}>{note}</span>
        </div>
        {/* tonnage counter */}
        <div style={{position: 'absolute', left: 120, top: y2 + 160, fontFamily: SANS, fontWeight: 800, fontSize: 168, letterSpacing: -6, color: C.ink, fontVariantNumeric: 'tabular-nums', transform: `scale(${1 + 0.08 * pop * (1 - mark)})`, transformOrigin: 'left center', opacity: in2 < 1 ? 1 : 0}}>
          {count.toLocaleString('en-US')}<span style={{fontSize: 84, marginLeft: 14, color: C.marker}}>{unit}</span>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', opacity: capIn}}>
        <span style={{fontFamily: TYPE, fontSize: 42, color: C.ink, borderBottom: `3px solid ${C.ink}`, paddingBottom: 6}}>{caption}</span>
      </div>
    </Paper>
  );
};
