import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import type {Overlay} from '../scenes';
import {MAPS} from '../maps';
import {C, CJK, HAND, MARKER, SANS, TYPE} from '../theme';
import {MapScene} from './MapScene';
import {Paper} from './Paper';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 18});
};
const useSweep = (delay: number, len = 14) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + len], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
};

// Graphics that own the whole frame (drawn on paper) vs. ones laid over footage.
export const FULL_FRAME = new Set<Overlay['type']>(['stat', 'bars', 'quote', 'note', 'timeline', 'price', 'route', 'map']);

// Yellow highlighter swiping across text, like a marked-up document.
const Hi: React.FC<{children: React.ReactNode; delay: number}> = ({children, delay}) => {
  const p = useSweep(delay, 12);
  return (
    <span style={{backgroundImage: `linear-gradient(${C.highlighter}, ${C.highlighter})`, backgroundRepeat: 'no-repeat', backgroundSize: `${p * 100}% 78%`, backgroundPosition: '0 70%', padding: '0 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>
      {children}
    </span>
  );
};

// Hand-drawn red marker loop around something (drawn on).
const MarkerCircle: React.FC<{w: number; h: number; x: number; y: number; delay: number}> = ({w, h, x, y, delay}) => {
  const p = useSweep(delay, 16);
  const d = `M ${w * 0.12} ${h * 0.12} C ${w * 0.45} ${-h * 0.08}, ${w * 1.05} ${h * 0.02}, ${w * 0.98} ${h * 0.5} C ${w * 0.92} ${h * 1.02}, ${w * 0.08} ${h * 1.06}, ${w * 0.02} ${h * 0.55} C ${-w * 0.02} ${h * 0.2}, ${w * 0.3} ${h * 0.02}, ${w * 0.62} ${h * 0.04}`;
  return (
    <svg width={w} height={h} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
      <path d={d} fill="none" stroke={C.marker} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - p} />
    </svg>
  );
};

const Scribble: React.FC<{text: string; x: number; y: number; delay: number; rotate?: number; size?: number}> = ({text, x, y, delay, rotate = -5, size = 54}) => {
  const p = useIn(delay);
  return <div style={{position: 'absolute', left: x, top: y, fontFamily: MARKER, fontSize: size, color: C.marker, transform: `rotate(${rotate}deg) scale(${0.85 + 0.15 * p})`, opacity: p, whiteSpace: 'pre', lineHeight: 1.05, textShadow: '0 2px 10px rgba(0,0,0,0.45)'}}>{text}</div>;
};

// Counts up the first number in the string (keeps prefix/suffix and thousands separators).
const Count: React.FC<{value: string; delay: number}> = ({value, delay}) => {
  const frame = useCurrentFrame();
  const m = value.match(/^([^\d]*)([\d,.]+)(.*)$/);
  if (!m) return <>{value}</>;
  const target = parseFloat(m[2].replace(/,/g, ''));
  const decimals = (m[2].split('.')[1] ?? '').length;
  const v = interpolate(frame, [delay, delay + 28], [0, target], {...clamp, easing: Easing.out(Easing.cubic)});
  const sep = m[2].includes(',');
  const s = sep ? v.toLocaleString('en-US', {minimumFractionDigits: decimals, maximumFractionDigits: decimals}) : v.toFixed(decimals);
  return <>{m[1]}{s}{m[3]}</>;
};

const Stat: React.FC<Extract<Overlay, {type: 'stat'}>> = ({value, label, sub}) => {
  const p = useIn(2);
  const p2 = useIn(14);
  const p3 = useIn(34);
  return (
    <Paper>
      <div style={{position: 'absolute', left: 150, top: 230, width: 1620}}>
        <div style={{position: 'relative', display: 'inline-block', fontFamily: SANS, fontWeight: 800, fontSize: 230, color: C.ink, lineHeight: 1, letterSpacing: -6, opacity: p}}>
          <Count value={value} delay={4} />
          <MarkerCircle w={Math.max(380, value.length * 128)} h={260} x={-46} y={-26} delay={32} />
        </div>
        <div style={{fontFamily: TYPE, fontSize: 54, color: C.ink, marginTop: 50, opacity: p2, maxWidth: 1450, lineHeight: 1.3}}>
          <Hi delay={22}>{label}</Hi>
        </div>
        {sub ? <div style={{fontFamily: HAND, fontSize: 58, color: C.inkSoft, marginTop: 28, opacity: p3}}>{sub}</div> : null}
      </div>
    </Paper>
  );
};

const Bars: React.FC<Extract<Overlay, {type: 'bars'}>> = ({title, items, note}) => {
  const frame = useCurrentFrame();
  const head = useIn(0);
  const noteIn = useIn(56);
  const max = Math.max(...items.map((i) => i.value));
  const accentIdx = items.findIndex((i) => i.accent);
  return (
    <Paper>
      <div style={{position: 'absolute', left: 150, right: 150, top: 150}}>
        <div style={{fontFamily: TYPE, fontSize: 46, color: C.ink, opacity: head, marginBottom: 70, borderBottom: `3px solid ${C.ink}`, paddingBottom: 16, display: 'inline-block'}}>{title}</div>
        {items.map((it, i) => {
          const grow = interpolate(frame, [10 + i * 14, 44 + i * 14], [0, it.value / max], {...clamp, easing: Easing.out(Easing.cubic)});
          return (
            <div key={it.label} style={{marginBottom: 56}}>
              <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 36, color: C.inkSoft, marginBottom: 12}}>{it.label}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 30}}>
                <div style={{height: 84, width: Math.max(grow * 1100, 8), background: it.accent ? C.marker : C.ink, opacity: it.accent ? 1 : 0.78, borderRadius: 3, boxShadow: '4px 5px 0 rgba(0,0,0,0.12)'}} />
                <div style={{position: 'relative', fontFamily: SANS, fontWeight: 800, fontSize: 72, color: C.ink, opacity: grow > 0.02 ? 1 : 0, whiteSpace: 'nowrap'}}>
                  {it.display}
                  {i === accentIdx ? <MarkerCircle w={it.display.length * 44 + 90} h={124} x={-44} y={-20} delay={52} /> : null}
                </div>
              </div>
            </div>
          );
        })}
        {note ? <div style={{fontFamily: MARKER, fontSize: 48, color: C.marker, marginTop: 6, opacity: noteIn, transform: 'rotate(-2deg)'}}>→ {note}</div> : null}
      </div>
    </Paper>
  );
};

// Index card / research note: typewriter text, then a highlighter pass on the key phrase.
const NoteCard: React.FC<{text: string; by: string; highlight?: string; quote?: boolean}> = ({text, by, highlight, quote}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const doneAt = 6 + text.length * 0.8;
  const chars = Math.floor(interpolate(frame, [6, doneAt], [0, text.length], clamp));
  const typedAll = chars >= text.length;
  const hiStart = highlight ? text.indexOf(highlight) : -1;
  return (
    <Paper>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{position: 'relative', width: 1400, background: '#FBF7EC', padding: '86px 100px 70px', boxShadow: '0 18px 40px rgba(40,25,10,0.28)', transform: `rotate(-1.5deg) translateY(${(1 - p) * 60}px)`, opacity: p, backgroundImage: 'repeating-linear-gradient(transparent 0 66px, rgba(80,120,170,0.22) 66px 68px)', backgroundPosition: '0 72px'}}>
          <div style={{position: 'absolute', top: -26, left: '42%', width: 220, height: 56, background: 'rgba(230,220,190,0.85)', transform: 'rotate(3deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.12)'}} />
          <div style={{fontFamily: TYPE, fontSize: 56, lineHeight: '68px', color: C.ink}}>
            {quote ? '“' : ''}
            {typedAll && hiStart >= 0 ? (
              <>
                {text.slice(0, hiStart)}
                <Hi delay={doneAt + 4}>{highlight}</Hi>
                {text.slice(hiStart + highlight!.length)}
              </>
            ) : (
              text.slice(0, chars)
            )}
            {quote && typedAll ? '”' : ''}
            {!typedAll ? <span style={{opacity: frame % 16 < 8 ? 1 : 0}}>▌</span> : null}
          </div>
          <div style={{fontFamily: MARKER, fontSize: 42, color: C.marker, marginTop: 36, textAlign: 'right', opacity: typedAll ? 1 : 0}}>{by}</div>
        </div>
      </AbsoluteFill>
    </Paper>
  );
};

// Kinetic text. Over footage: white words on dark bars; on paper: ink words.
const Callout: React.FC<{text: string; sub?: string; onPaper: boolean}> = ({text, sub, onPaper}) => {
  const frame = useCurrentFrame();
  const cjk = /[一-鿿]/.test(text);
  const words = cjk ? [text] : text.split(' ');
  const subIn = useIn(10 + words.length * 3);
  const big = cjk ? 200 : text.length > 42 ? 84 : text.length > 24 ? 104 : 130;
  const body = (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 170px'}}>
      <div style={{fontFamily: cjk ? CJK : SANS, fontWeight: 800, fontSize: big, lineHeight: 1.18, textAlign: 'center', letterSpacing: cjk ? 8 : -2, color: onPaper ? C.ink : '#fff'}}>
        {words.map((w, i) => {
          const s = interpolate(frame, [2 + i * 3, 8 + i * 3], [0, 1], clamp);
          return (
            <span key={i} style={{display: 'inline-block', opacity: s, transform: `translateY(${(1 - s) * 24}px)`, marginRight: '0.22em'}}>
              {onPaper ? w : <span style={{background: 'rgba(15,10,8,0.85)', padding: '0 14px'}}>{w}</span>}
            </span>
          );
        })}
      </div>
      {sub ? (
        <div style={{fontFamily: onPaper ? HAND : SANS, fontWeight: 700, fontSize: onPaper ? 62 : 38, color: onPaper ? C.marker : C.ink, background: onPaper ? undefined : C.gold, padding: onPaper ? 0 : '6px 18px', marginTop: 34, textAlign: 'center', opacity: subIn}}>{sub}</div>
      ) : null}
    </AbsoluteFill>
  );
  return onPaper ? <Paper>{body}</Paper> : <AbsoluteFill style={{background: 'rgba(8,5,5,0.2)'}}>{body}</AbsoluteFill>;
};

const Timeline: React.FC<Extract<Overlay, {type: 'timeline'}>> = ({points}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [6, 56], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const span = parseInt(points[points.length - 1].year) - parseInt(points[0].year);
  return (
    <Paper>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <path d="M 260 560 C 700 552, 1200 570, 1660 558" fill="none" stroke={C.ink} strokeWidth={8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - line} />
      </svg>
      {points.map((pt, i) => {
        const x = 260 + (1400 * i) / Math.max(1, points.length - 1);
        const shown = line >= i / Math.max(1, points.length - 1) - 0.001;
        return (
          <div key={pt.year} style={{position: 'absolute', left: x - 220, width: 440, top: 370, textAlign: 'center', opacity: shown ? 1 : 0}}>
            <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 120, color: C.ink, letterSpacing: -4}}>{pt.year}</div>
            <div style={{width: 40, height: 40, borderRadius: 20, background: C.marker, margin: '18px auto', border: `5px solid ${C.paper}`}} />
            <div style={{fontFamily: TYPE, fontSize: 40, color: C.ink}}>{pt.label}</div>
          </div>
        );
      })}
      {!isNaN(span) ? <Scribble text={`${span} years!`} x={830} y={720} delay={60} rotate={-3} size={64} /> : null}
    </Paper>
  );
};

const Price: React.FC<Extract<Overlay, {type: 'price'}>> = ({from, to, label}) => {
  const frame = useCurrentFrame();
  const draw = interpolate(frame, [6, 50], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const p1 = useIn(4);
  const p2 = useIn(40);
  return (
    <Paper>
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <line x1={200} y1={860} x2={1720} y2={860} stroke={C.ink} strokeWidth={4} />
        <line x1={200} y1={200} x2={200} y2={860} stroke={C.ink} strokeWidth={4} />
        <path d="M 200 300 C 420 260, 640 330, 820 380 S 1180 520, 1350 640 S 1600 770, 1700 790" fill="none" stroke={C.marker} strokeWidth={12} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        {draw > 0.98 ? <path d="M 1700 790 l -40 -6 M 1700 790 l -22 -34" stroke={C.marker} strokeWidth={12} strokeLinecap="round" /> : null}
      </svg>
      {from ? <div style={{position: 'absolute', left: 240, top: 170, fontFamily: SANS, fontWeight: 800, fontSize: 70, color: C.inkSoft, textDecoration: 'line-through', textDecorationColor: C.marker, textDecorationThickness: 8, opacity: p1}}>{from}</div> : null}
      <div style={{position: 'absolute', right: 180, top: 520, fontFamily: SANS, fontWeight: 800, fontSize: 116, color: C.marker, opacity: p2, textAlign: 'right'}}>{to}</div>
      <div style={{position: 'absolute', left: 240, bottom: 110, fontFamily: TYPE, fontSize: 40, color: C.ink, opacity: p2}}>{label}</div>
    </Paper>
  );
};

const RouteStep: React.FC<{big: string; small: string; delay: number}> = ({big, small, delay}) => {
  const p = useIn(delay);
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 40, marginBottom: 70, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{fontFamily: MARKER, fontSize: 70, color: C.marker, width: 60}}>✓</div>
      <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 104, color: C.ink, minWidth: 600, letterSpacing: -3, whiteSpace: 'nowrap'}}>{big}</div>
      <div style={{fontFamily: TYPE, fontSize: 42, color: C.ink, maxWidth: 800, lineHeight: 1.3}}>
        <Hi delay={delay + 12}>{small}</Hi>
      </div>
    </div>
  );
};
const Route: React.FC<Extract<Overlay, {type: 'route'}>> = ({steps}) => (
  <Paper>
    <div style={{position: 'absolute', left: 150, top: 220}}>
      {steps.map((s, i) => (
        <RouteStep key={s.big} {...s} delay={6 + i * 24} />
      ))}
    </div>
  </Paper>
);

const Stamp: React.FC<{text: string; sub: string}> = ({text, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const subIn = useIn(30);
  const hit = spring({frame: frame - 16, fps, config: {damping: 11, stiffness: 190}});
  return (
    <AbsoluteFill style={{background: 'rgba(8,5,5,0.3)'}}>
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{border: `16px solid ${C.marker}`, color: C.marker, fontFamily: SANS, fontWeight: 800, fontSize: 180, letterSpacing: 14, padding: '6px 54px', transform: `rotate(-11deg) scale(${interpolate(hit, [0, 1], [2.4, 1])})`, opacity: hit * 0.95, borderRadius: 20, background: 'rgba(250,240,230,0.85)'}}>{text}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 100, textAlign: 'center'}}>
        <span style={{fontFamily: TYPE, fontSize: 42, color: C.ink, background: C.paper, padding: '10px 24px', opacity: subIn}}>{sub}</span>
      </div>
    </AbsoluteFill>
  );
};

const Location: React.FC<{text: string}> = ({text}) => {
  const p = useIn(10);
  return (
    <div style={{position: 'absolute', left: 90, bottom: 110, fontFamily: TYPE, fontSize: 44, color: C.ink, background: C.paper, padding: '12px 26px', boxShadow: '0 6px 18px rgba(0,0,0,0.35)', transform: `rotate(-1.5deg) translateY(${(1 - p) * 30}px)`, opacity: p}}>
      {text}
    </div>
  );
};

export const OverlayView: React.FC<{o: Overlay; dur: number; onPaper: boolean}> = ({o, dur, onPaper}) => {
  switch (o.type) {
    case 'stat': return <Stat {...o} />;
    case 'bars': return <Bars {...o} />;
    case 'quote': return <NoteCard text={o.text} by={o.by} highlight={o.highlight} quote />;
    case 'note': return <NoteCard text={o.text} by={o.by} highlight={o.highlight} />;
    case 'callout': return <Callout text={o.text} sub={o.sub} onPaper={onPaper} />;
    case 'route': return <Route {...o} />;
    case 'timeline': return <Timeline {...o} />;
    case 'price': return <Price {...o} />;
    case 'stamp': return <Stamp {...o} />;
    case 'location': return <Location {...o} />;
    case 'map': return <MapScene spec={MAPS[o.map]} dur={dur} />;
    case 'scribbles': return <>{o.items.map((s, i) => <Scribble key={i} {...s} delay={s.delay ?? 20 + i * 18} />)}</>;
  }
};

export const SourceTag: React.FC<{text: string; onPaper: boolean}> = ({text, onPaper}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [20, 34], [0, 0.9], clamp);
  return <div style={{position: 'absolute', right: 56, bottom: 40, fontFamily: TYPE, fontSize: 24, color: onPaper ? C.inkSoft : C.bone, opacity: o, background: onPaper ? 'transparent' : 'rgba(8,5,5,0.55)', padding: '6px 14px'}}>Source: {text}</div>;
};
