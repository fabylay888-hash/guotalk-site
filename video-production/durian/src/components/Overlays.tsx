import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import type {Overlay} from '../scenes';
import {C, CJK, SANS, SERIF} from '../theme';

const useIn = (delay = 0) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 20});
};

const Scrim: React.FC<{strength?: number; side?: 'left' | 'bottom' | 'full'}> = ({strength = 0.75, side = 'full'}) => {
  const bg =
    side === 'left'
      ? `linear-gradient(90deg, rgba(8,5,5,${strength}) 0%, rgba(8,5,5,${strength * 0.6}) 45%, transparent 75%)`
      : side === 'bottom'
        ? `linear-gradient(0deg, rgba(8,5,5,${strength}) 0%, transparent 45%)`
        : `rgba(8,5,5,${strength * 0.7})`;
  return <AbsoluteFill style={{background: bg}} />;
};

const Stat: React.FC<{value: string; label: string; sub?: string}> = ({value, label, sub}) => {
  const p = useIn(4);
  const p2 = useIn(14);
  return (
    <AbsoluteFill>
      <Scrim side="left" />
      <div style={{position: 'absolute', left: 140, top: 300, maxWidth: 1100}}>
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 200, color: C.gold, lineHeight: 1, transform: `translateY(${(1 - p) * 40}px)`, opacity: p}}>{value}</div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 52, color: C.bone, marginTop: 24, opacity: p2, transform: `translateY(${(1 - p2) * 20}px)`}}>{label}</div>
        {sub ? <div style={{fontFamily: SANS, fontSize: 34, color: C.muted, marginTop: 18, opacity: p2}}>{sub}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const Bars: React.FC<Extract<Overlay, {type: 'bars'}>> = ({title, items, note}) => {
  const frame = useCurrentFrame();
  const head = useIn(0);
  const max = Math.max(...items.map((i) => i.value));
  const noteIn = useIn(40);
  return (
    <AbsoluteFill>
      <Scrim strength={0.85} />
      <div style={{position: 'absolute', left: 160, right: 160, top: 220}}>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 44, color: C.bone, opacity: head, marginBottom: 60}}>{title}</div>
        {items.map((it, i) => {
          const grow = interpolate(frame, [10 + i * 12, 40 + i * 12], [0, it.value / max], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
          const color = it.accent ? C.gold : C.muted;
          return (
            <div key={it.label} style={{marginBottom: 44}}>
              <div style={{fontFamily: SANS, fontSize: 34, color: C.bone, marginBottom: 12, opacity: 0.85}}>{it.label}</div>
              <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
                <div style={{height: 70, width: `${Math.max(grow * 1150, 6)}px`, background: color, borderRadius: 6}} />
                <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 64, color, opacity: grow > 0.02 ? 1 : 0}}>{it.display}</div>
              </div>
            </div>
          );
        })}
        {note ? <div style={{fontFamily: SANS, fontSize: 32, color: C.muted, marginTop: 20, opacity: noteIn}}>{note}</div> : null}
      </div>
    </AbsoluteFill>
  );
};

const Quote: React.FC<{text: string; by: string}> = ({text, by}) => {
  const p = useIn(4);
  const byIn = useIn(18);
  return (
    <AbsoluteFill>
      <Scrim strength={0.8} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 220px'}}>
        <div style={{fontFamily: SERIF, fontSize: 200, color: C.gold, lineHeight: 0.6, height: 90, opacity: p}}>“</div>
        <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 70, color: C.bone, textAlign: 'center', lineHeight: 1.2, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>{text}</div>
        <div style={{fontFamily: SANS, fontSize: 32, color: C.gold, marginTop: 40, letterSpacing: 2, textTransform: 'uppercase', opacity: byIn}}>{by}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Callout: React.FC<{text: string; sub?: string}> = ({text, sub}) => {
  const p = useIn(2);
  const subIn = useIn(14);
  const cjk = /[\u4e00-\u9fff]/.test(text);
  return (
    <AbsoluteFill>
      <Scrim strength={0.65} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 200px'}}>
        <div style={{fontFamily: cjk ? CJK : SERIF, fontWeight: 800, fontSize: cjk ? 190 : text.length > 40 ? 76 : 110, color: C.bone, textAlign: 'center', lineHeight: 1.12, opacity: p, transform: `scale(${0.94 + 0.06 * p})`}}>{text}</div>
        {sub ? <div style={{fontFamily: SANS, fontSize: 38, color: C.gold, marginTop: 36, textAlign: 'center', opacity: subIn}}>{sub}</div> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// Schematic (not to scale) supply map: Thailand / Vietnam / Malaysia → China.
const NODES = {
  china: {x: 1180, y: 220, label: 'CHINA'},
  thailand: {x: 760, y: 560, label: 'Thailand'},
  vietnam: {x: 1120, y: 540, label: 'Vietnam'},
  malaysia: {x: 820, y: 790, label: 'Malaysia'},
};
const Flow: React.FC<Extract<Overlay, {type: 'flow'}>> = ({active, caption}) => {
  const frame = useCurrentFrame();
  const p = useIn(0);
  const capIn = useIn(20);
  return (
    <AbsoluteFill>
      <Scrim strength={0.9} />
      <svg width={1920} height={1080} style={{position: 'absolute', opacity: p}}>
        {(['thailand', 'vietnam', 'malaysia'] as const).map((k, i) => {
          const n = NODES[k];
          const on = active.includes(k);
          const draw = on ? interpolate(frame, [8 + i * 10, 38 + i * 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 0;
          const len = Math.hypot(NODES.china.x - n.x, NODES.china.y - n.y);
          return (
            <g key={k}>
              <line x1={n.x} y1={n.y} x2={NODES.china.x} y2={NODES.china.y} stroke={C.gold} strokeWidth={8} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} opacity={0.9} />
              <circle cx={n.x} cy={n.y} r={on ? 26 : 16} fill={on ? C.gold : 'none'} stroke={on ? C.gold : C.muted} strokeWidth={4} />
              <text x={n.x} y={n.y + 70} textAnchor="middle" fontFamily={SANS} fontWeight={600} fontSize={40} fill={on ? C.bone : C.muted}>{n.label}</text>
            </g>
          );
        })}
        <circle cx={NODES.china.x} cy={NODES.china.y} r={46} fill={C.red} />
        <text x={NODES.china.x} y={NODES.china.y - 72} textAnchor="middle" fontFamily={SERIF} fontWeight={800} fontSize={56} fill={C.bone}>{NODES.china.label}</text>
      </svg>
      {caption ? <div style={{position: 'absolute', left: 120, right: 120, bottom: 70, fontFamily: SANS, fontWeight: 600, fontSize: 40, color: C.bone, textAlign: 'center', opacity: capIn}}>{caption}</div> : null}
    </AbsoluteFill>
  );
};

const Route: React.FC<Extract<Overlay, {type: 'route'}>> = ({steps}) => (
  <AbsoluteFill>
    <Scrim side="left" strength={0.85} />
    <div style={{position: 'absolute', left: 140, top: 230}}>
      {steps.map((s, i) => (
        <RouteStep key={s.big} {...s} delay={6 + i * 22} />
      ))}
    </div>
  </AbsoluteFill>
);
const RouteStep: React.FC<{big: string; small: string; delay: number}> = ({big, small, delay}) => {
  const p = useIn(delay);
  return (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 36, marginBottom: 54, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
      <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: C.gold, minWidth: 420}}>{big}</div>
      <div style={{fontFamily: SANS, fontSize: 42, color: C.bone, maxWidth: 820}}>{small}</div>
    </div>
  );
};

const Timeline: React.FC<Extract<Overlay, {type: 'timeline'}>> = ({points}) => {
  const frame = useCurrentFrame();
  const line = interpolate(frame, [6, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Scrim strength={0.85} />
      <div style={{position: 'absolute', left: 260, right: 260, top: 560, height: 8, background: C.muted, opacity: 0.4}} />
      <div style={{position: 'absolute', left: 260, top: 560, height: 8, width: 1400 * line, background: C.gold}} />
      {points.map((pt, i) => {
        const x = 260 + (1400 * i) / Math.max(1, points.length - 1);
        const shown = line >= i / Math.max(1, points.length - 1) - 0.001;
        return (
          <div key={pt.year} style={{position: 'absolute', left: x - 200, width: 400, top: 380, textAlign: 'center', opacity: shown ? 1 : 0.15}}>
            <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 110, color: C.gold}}>{pt.year}</div>
            <div style={{width: 34, height: 34, borderRadius: 17, background: C.gold, margin: '22px auto'}} />
            <div style={{fontFamily: SANS, fontSize: 38, color: C.bone}}>{pt.label}</div>
          </div>
        );
      })}
      <div style={{position: 'absolute', left: 0, right: 0, top: 820, textAlign: 'center', fontFamily: SANS, fontSize: 40, color: C.muted, opacity: line}}>61 years</div>
    </AbsoluteFill>
  );
};

const Price: React.FC<Extract<Overlay, {type: 'price'}>> = ({from, to, label}) => {
  const frame = useCurrentFrame();
  const p = useIn(2);
  const slash = interpolate(frame, [14, 26], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const p2 = useIn(24);
  return (
    <AbsoluteFill>
      <Scrim side="left" strength={0.85} />
      <div style={{position: 'absolute', left: 140, top: 330}}>
        {from ? (
          <div style={{position: 'relative', display: 'inline-block', fontFamily: SERIF, fontWeight: 800, fontSize: 120, color: C.muted, opacity: p}}>
            {from}
            <div style={{position: 'absolute', left: -10, top: '52%', height: 12, width: `${slash * 110}%`, background: C.red, transform: 'rotate(-8deg)'}} />
          </div>
        ) : null}
        <div style={{fontFamily: SERIF, fontWeight: 800, fontSize: 130, color: C.red, opacity: from ? p2 : p, display: 'flex', alignItems: 'center', gap: 24}}>
          <span style={{fontSize: 110}}>↘</span>
          {to}
        </div>
        <div style={{fontFamily: SANS, fontSize: 38, color: C.bone, marginTop: 20, opacity: p2}}>{label}</div>
      </div>
    </AbsoluteFill>
  );
};

const Stamp: React.FC<{text: string; sub: string}> = ({text, sub}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const subIn = useIn(30);
  const hit = spring({frame: frame - 18, fps, config: {damping: 12, stiffness: 180}});
  return (
    <AbsoluteFill>
      <Scrim strength={0.55} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{border: `14px solid ${C.red}`, color: C.red, fontFamily: SANS, fontWeight: 800, fontSize: 170, letterSpacing: 12, padding: '10px 50px', transform: `rotate(-12deg) scale(${interpolate(hit, [0, 1], [2.2, 1])})`, opacity: hit, borderRadius: 18}}>{text}</div>
      </AbsoluteFill>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 110, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 42, color: C.bone, opacity: subIn}}>{sub}</div>
    </AbsoluteFill>
  );
};

const Location: React.FC<{text: string}> = ({text}) => {
  const p = useIn(10);
  return (
    <AbsoluteFill>
      <Scrim side="bottom" strength={0.7} />
      <div style={{position: 'absolute', left: 120, bottom: 120, display: 'flex', alignItems: 'center', gap: 22, opacity: p, transform: `translateY(${(1 - p) * 20}px)`}}>
        <div style={{width: 10, height: 64, background: C.gold}} />
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 48, color: C.bone, letterSpacing: 1}}>{text}</div>
      </div>
    </AbsoluteFill>
  );
};

export const OverlayView: React.FC<{o: Overlay}> = ({o}) => {
  switch (o.type) {
    case 'stat': return <Stat {...o} />;
    case 'bars': return <Bars {...o} />;
    case 'quote': return <Quote {...o} />;
    case 'callout': return <Callout {...o} />;
    case 'flow': return <Flow {...o} />;
    case 'route': return <Route {...o} />;
    case 'timeline': return <Timeline {...o} />;
    case 'price': return <Price {...o} />;
    case 'stamp': return <Stamp {...o} />;
    case 'location': return <Location {...o} />;
  }
};

export const SourceTag: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [20, 34], [0, 0.85], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return <div style={{position: 'absolute', right: 56, bottom: 40, fontFamily: SANS, fontSize: 24, color: C.bone, opacity: o, background: 'rgba(8,5,5,0.55)', padding: '6px 14px', borderRadius: 6}}>Source: {text}</div>;
};
