import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {geoMercator, geoPath, type GeoPermissibleObjects} from 'd3-geo';
import {feature} from 'topojson-client';
import world from 'world-atlas/countries-50m.json';
import {C, HAND, MARKER, SANS, TYPE} from '../theme';
import {Paper} from './Paper';

type LL = [number, number];
type Cam = {c: LL; z: number};
export type MapSpec = {
  from: Cam;
  to?: Cam;
  highlight?: Record<string, 'gold' | 'red' | 'dim'>;
  labels?: {at: LL; text: string; size?: number; delay?: number; color?: string}[];
  pins?: {at: LL; label?: string; delay?: number}[];
  routes?: {path: LL[]; delay?: number; dur?: number; dashed?: boolean; color?: string; mover?: string}[];
  arrows?: {from: LL; to: LL; delay?: number; color?: string; width?: number; bend?: number}[];
  notes?: {text: string; x: number; y: number; rotate?: number; delay?: number; size?: number}[];
  band?: {lat1: number; lat2: number; label: string};
  burst?: {origin: LL; cities: LL[]; delay: number};
  title?: string;
  // Tilted 3D camera (perspective) instead of flat top-down paper map.
  tilt?: boolean;
  // Big country name fixed at the top of the frame.
  header?: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const COUNTRIES = (feature(world as any, (world as any).objects.countries) as any).features as {properties: {name: string}}[];

const ease = Easing.inOut(Easing.cubic);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const MapScene: React.FC<{spec: MapSpec; dur: number}> = ({spec, dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, Math.max(1, dur * 0.85)], [0, 1], {...clamp, easing: ease});
  const to = spec.to ?? spec.from;
  // Interpolate zoom in log space so pushes feel like a camera move.
  const z = Math.exp(interpolate(t, [0, 1], [Math.log(spec.from.z), Math.log(to.z)]));
  const c: LL = [interpolate(t, [0, 1], [spec.from.c[0], to.c[0]]), interpolate(t, [0, 1], [spec.from.c[1], to.c[1]])];
  const proj = useMemo(() => geoMercator(), []);
  proj.scale(z).center(c).translate([960, 540]);
  const path = geoPath(proj);
  const P = (ll: LL) => proj(ll) as [number, number];
  const appear = (d = 0) => spring({frame: frame - d, fps, config: {damping: 200}, durationInFrames: 18});

  const fill = (name: string) => {
    const h = spec.highlight?.[name];
    if (h === 'gold') return C.gold;
    if (h === 'red') return C.marker;
    if (h === 'dim') return '#E2D8C3';
    return C.land;
  };

  const tiltT = spec.tilt ? interpolate(frame, [0, 40], [0, 1], {...clamp, easing: ease}) : 0;
  return (
    <AbsoluteFill style={{background: C.sea, overflow: 'hidden'}}>
      <AbsoluteFill style={{perspective: 1500, perspectiveOrigin: '50% 30%'}}>
      <AbsoluteFill style={{transform: `rotateX(${50 * tiltT}deg) scale(${1 + 0.45 * tiltT}) translateY(${-60 * tiltT}px)`, transformOrigin: '50% 60%'}}>
      <AbsoluteFill style={{background: C.sea}} />
      <svg width={1920} height={1080} style={{position: 'absolute', overflow: 'visible'}}>
        <defs>
          <pattern id="hatch" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
            <line x1="0" y1="0" x2="0" y2="14" stroke={C.marker} strokeWidth="3" opacity="0.35" />
          </pattern>
        </defs>
        {COUNTRIES.map((f, i) => {
          const d = path(f as unknown as GeoPermissibleObjects);
          if (!d) return null;
          const hl = spec.highlight?.[f.properties.name];
          return <path key={i} d={d} fill={fill(f.properties.name)} stroke={hl ? C.ink : C.border} strokeWidth={hl ? 2.5 : 1.2} strokeLinejoin="round" />;
        })}
        {spec.band ? <Band band={spec.band} P={P} op={appear(6)} /> : null}
        {(spec.routes ?? []).map((r, i) => {
          const d = 'M' + r.path.map((p) => P(p).join(',')).join(' L');
          const prog = interpolate(frame, [r.delay ?? 10, (r.delay ?? 10) + (r.dur ?? 60)], [0, 1], {...clamp, easing: ease});
          return (
            <g key={i}>
              <path d={d} fill="none" stroke={C.ink} strokeOpacity={0.25} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} />
              <path d={d} fill="none" stroke={r.color ?? C.marker} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={r.dashed ? '0.012 0.008' : '1'} strokeDashoffset={r.dashed ? 0 : 1 - prog} style={r.dashed ? {clipPath: undefined} : undefined} opacity={r.dashed ? (prog > 0 ? 1 : 0) : 1} mask={r.dashed ? undefined : undefined} />
              {r.dashed ? <path d={d} fill="none" stroke={C.sea} strokeWidth={10} pathLength={1} strokeDasharray="1" strokeDashoffset={-prog} /> : null}
              {r.mover && prog > 0 && prog < 1 ? <Mover pts={r.path.map(P)} prog={prog} icon={r.mover} tilt={!!spec.tilt} /> : null}
            </g>
          );
        })}
        {(spec.arrows ?? []).map((a, i) => <Arrow key={i} a={a} P={P} frame={frame} />)}
        {spec.burst ? <Burst burst={spec.burst} P={P} frame={frame} /> : null}
        {(spec.pins ?? []).map((p, i) => {
          const [x, y] = P(p.at);
          const s = appear(p.delay ?? 8);
          return (
            <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
              <circle r={13} fill={C.marker} stroke={C.paper} strokeWidth={4} />
              {p.label ? (
                <text x={22} y={10} fontFamily={SANS} fontWeight={800} fontSize={30} fill={C.ink} stroke={C.paper} strokeWidth={6} paintOrder="stroke">
                  {p.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {(spec.labels ?? []).map((l, i) => {
          const [x, y] = P(l.at);
          return (
            <text key={i} x={x} y={y} textAnchor="middle" fontFamily={SANS} fontWeight={800} fontSize={l.size ?? 40} letterSpacing={4} fill={l.color ?? C.ink} opacity={appear(l.delay ?? 4)} stroke={C.paper} strokeWidth={l.color ? 0 : 5} paintOrder="stroke">
              {l.text.toUpperCase()}
            </text>
          );
        })}
      </svg>
      </AbsoluteFill>
      </AbsoluteFill>
      {/* Handwritten notes stay flat on screen, even when the map is tilted */}
      {(spec.notes ?? []).map((n, i) => {
        const s = appear(n.delay ?? 30);
        return (
          <div key={i} style={{position: 'absolute', left: n.x, top: n.y, fontFamily: MARKER, fontSize: n.size ?? 52, color: C.marker, transform: `rotate(${n.rotate ?? -4}deg) scale(${0.9 + 0.1 * s})`, opacity: s, textShadow: `0 0 8px ${C.paper}, 0 0 2px ${C.paper}`, whiteSpace: 'pre', lineHeight: 1.05}}>
            {n.text}
          </div>
        );
      })}
      {spec.header ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 46, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 110, letterSpacing: 18, color: C.ink, opacity: appear(4), textShadow: `0 0 18px ${C.paper}, 0 0 4px ${C.paper}`}}>{spec.header}</div>
      ) : null}
      {spec.title ? (
        <div style={{position: 'absolute', left: 56, top: 44, fontFamily: TYPE, fontSize: 30, color: C.ink, background: C.paper, padding: '8px 16px', boxShadow: '0 3px 10px rgba(0,0,0,0.2)', opacity: appear(0)}}>{spec.title}</div>
      ) : null}
      <Paper overlayOnly />
    </AbsoluteFill>
  );
};

const Arrow: React.FC<{a: NonNullable<MapSpec['arrows']>[number]; P: (l: LL) => [number, number]; frame: number}> = ({a, P, frame}) => {
  const [x1, y1] = P(a.from);
  const [x2, y2] = P(a.to);
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const bend = a.bend ?? 0.25;
  const cx = mx - (y2 - y1) * bend;
  const cy = my + (x2 - x1) * bend;
  const prog = interpolate(frame, [a.delay ?? 12, (a.delay ?? 12) + 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  // Arrow head at the end tangent
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const hs = 26;
  const col = a.color ?? C.ink;
  const head = `M${x2},${y2} L${x2 - hs * Math.cos(ang - 0.45)},${y2 - hs * Math.sin(ang - 0.45)} M${x2},${y2} L${x2 - hs * Math.cos(ang + 0.45)},${y2 - hs * Math.sin(ang + 0.45)}`;
  return (
    <g>
      {/* paper-coloured halo keeps the arrow readable on any fill */}
      <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none" stroke={C.paper} strokeWidth={(a.width ?? 9) + 8} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} />
      {prog > 0.97 ? <path d={head} stroke={C.paper} strokeWidth={(a.width ?? 9) + 8} strokeLinecap="round" /> : null}
      <path d={`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`} fill="none" stroke={col} strokeWidth={a.width ?? 9} strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - prog} />
      {prog > 0.97 ? <path d={head} stroke={col} strokeWidth={a.width ?? 9} strokeLinecap="round" /> : null}
    </g>
  );
};

const Band: React.FC<{band: NonNullable<MapSpec['band']>; P: (l: LL) => [number, number]; op: number}> = ({band, P, op}) => {
  const [, y1] = P([100, band.lat2]);
  const [, y2] = P([100, band.lat1]);
  return (
    <g opacity={op}>
      <rect x={0} y={y1} width={1920} height={y2 - y1} fill="url(#hatch)" />
      <line x1={0} x2={1920} y1={y1} y2={y1} stroke={C.marker} strokeWidth={3} strokeDasharray="14 10" />
      <line x1={0} x2={1920} y1={y2} y2={y2} stroke={C.marker} strokeWidth={3} strokeDasharray="14 10" />
      <text x={1880} y={y1 - 14} textAnchor="end" fontFamily={MARKER} fontSize={44} fill={C.marker} stroke={C.paper} strokeWidth={6} paintOrder="stroke">{band.label}</text>
    </g>
  );
};

const Burst: React.FC<{burst: NonNullable<MapSpec['burst']>; P: (l: LL) => [number, number]; frame: number}> = ({burst, P, frame}) => {
  const [ox, oy] = P(burst.origin);
  return (
    <g>
      {burst.cities.map((c, i) => {
        const [x, y] = P(c);
        const d = burst.delay + i * 2;
        const prog = interpolate(frame, [d, d + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <g key={i}>
            <line x1={ox} y1={oy} x2={ox + (x - ox) * prog} y2={oy + (y - oy) * prog} stroke={C.marker} strokeWidth={2.5} opacity={0.55} />
            <circle cx={x} cy={y} r={9 * prog} fill={C.marker} stroke={C.paper} strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

// A vehicle riding the route: walks the projected polyline to the current progress.
const Mover: React.FC<{pts: [number, number][]; prog: number; icon: string; tilt: boolean}> = ({pts, prog, icon, tilt}) => {
  const seg = pts.slice(1).map((p, i) => Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let d = prog * total;
  let i = 0;
  while (i < seg.length - 1 && d > seg[i]) d -= seg[i++];
  const f = seg[i] ? d / seg[i] : 0;
  const x = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f;
  const y = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
  return (
    <g transform={`translate(${x},${y})`}>
      <circle r={34} fill={C.paper} stroke={C.ink} strokeWidth={4} />
      <text y={14} textAnchor="middle" fontSize={40} transform={tilt ? 'scale(1,1.6)' : undefined}>{icon}</text>
    </g>
  );
};
