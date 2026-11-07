import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

export const Counter: React.FC<{
  value: number;
  delay?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  color?: string;
  size?: number;
  weight?: number;
}> = ({
  value,
  delay = 0,
  duration = 34,
  decimals = 0,
  prefix = '',
  suffix = '',
  color = C.white,
  size = 120,
  weight = 900,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame - delay, [0, duration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eased = 1 - Math.pow(1 - p, 3);
  const n = value * eased;
  return (
    <div
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: weight,
        color,
        letterSpacing: -2,
        lineHeight: 1,
        textShadow: `0 0 50px ${color}55`,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {prefix}
      {n.toFixed(decimals)}
      {suffix}
    </div>
  );
};

export const Gauge: React.FC<{
  value: number;
  threshold?: number;
  delay?: number;
  size?: number;
  label?: string;
}> = ({value, threshold = 0.7, delay = 0, size = 520, label = 'FEV1 / FVC'}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 26, stiffness: 60, mass: 1}});
  const v = value * p;
  const R = 200;
  const cx = size / 2;
  const cy = size / 2 + 60;
  const start = Math.PI;
  const end = 0;
  const angle = start + (end - start) * v;
  const arc = (from: number, to: number) => {
    const x1 = cx + Math.cos(from) * R;
    const y1 = cy + Math.sin(from) * R * 0.98;
    const x2 = cx + Math.cos(to) * R;
    const y2 = cy + Math.sin(to) * R * 0.98;
    const large = Math.abs(to - from) > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2}`;
  };
  const thrAngle = start + (end - start) * threshold;
  const danger = v < threshold;
  const color = danger ? C.pink : C.teal;

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} style={{overflow: 'visible'}}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={C.pink} />
          <stop offset="48%" stopColor={C.amber} />
          <stop offset="100%" stopColor={C.teal} />
        </linearGradient>
      </defs>
      <path d={arc(start, end)} stroke="rgba(120,170,210,0.2)" strokeWidth={26} fill="none" strokeLinecap="round" />
      <path d={arc(start, end)} stroke="url(#gaugeGrad)" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.5} />
      <path
        d={arc(start, angle)}
        stroke={color}
        strokeWidth={16}
        fill="none"
        strokeLinecap="round"
        style={{filter: `drop-shadow(0 0 16px ${color})`}}
      />
      <line
        x1={cx + Math.cos(thrAngle) * (R - 30)}
        y1={cy + Math.sin(thrAngle) * (R - 30)}
        x2={cx + Math.cos(thrAngle) * (R + 26)}
        y2={cy + Math.sin(thrAngle) * (R + 26)}
        stroke={C.white}
        strokeWidth={3}
        strokeDasharray="6 6"
        opacity={0.8}
      />
      <text
        x={cx + Math.cos(thrAngle) * (R + 56)}
        y={cy + Math.sin(thrAngle) * (R + 56) + 6}
        fill={C.white}
        fontSize={22}
        textAnchor="middle"
        opacity={0.85}
        fontFamily={FONT}
      >
        0.70
      </text>
      <circle cx={cx + Math.cos(angle) * R} cy={cy + Math.sin(angle) * R} r={9} fill={C.white} style={{filter: `drop-shadow(0 0 10px ${C.white})`}} />
      <text x={cx} y={cy - 34} fill={color} fontSize={72} fontWeight={900} textAnchor="middle" fontFamily={FONT}>
        {v.toFixed(2)}
      </text>
      <text x={cx} y={cy + 6} fill={C.dim} fontSize={21} textAnchor="middle" fontFamily={FONT} letterSpacing={3}>
        {label}
      </text>
      <text x={cx} y={cy + 74} fill={danger ? C.pink : C.teal} fontSize={24} fontWeight={700} textAnchor="middle" fontFamily={FONT} letterSpacing={2} opacity={p}>
        {danger ? '低于 0.70 · 通气受限' : '≥ 0.70 · 相对正常'}
      </text>
    </svg>
  );
};

export const RingStat: React.FC<{
  progress: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
  delay?: number;
}> = ({progress, size = 240, stroke = 14, color = C.cyan, children, delay = 0}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 24, stiffness: 50}});
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{width: size, height: size, position: 'relative'}}>
      <svg width={size} height={size} style={{transform: 'rotate(-90deg)'}}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(120,180,220,0.15)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress * p)}
          style={{filter: `drop-shadow(0 0 12px ${color})`}}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const BarRow: React.FC<{
  label: string;
  value: number;
  max?: number;
  color?: string;
  delay?: number;
  suffix?: string;
  height?: number;
}> = ({label, value, max = 100, color = C.cyan, delay = 0, suffix = '', height = 16}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 26, stiffness: 60}});
  return (
    <div style={{width: '100%'}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontFamily: FONT,
          fontSize: 22,
          color: C.text,
          marginBottom: 8,
          letterSpacing: 1,
        }}
      >
        <span>{label}</span>
        <span style={{color, fontWeight: 800}}>
          {Math.round(value * p)}
          {suffix}
        </span>
      </div>
      <div style={{height, borderRadius: 8, background: 'rgba(110,170,210,0.13)', overflow: 'hidden'}}>
        <div
          style={{
            width: `${(value / max) * 100 * p}%`,
            height: '100%',
            borderRadius: 8,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 18px ${color}99`,
          }}
        />
      </div>
    </div>
  );
};
