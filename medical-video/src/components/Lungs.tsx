import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../theme';

/**
 * Stylised anatomical lungs. All motion is frame-driven.
 * breath: 0..1 inflate amount, damage: 0..1 disease amount, draw: 0..1 line reveal.
 */
export const Lungs: React.FC<{
  width?: number;
  breath?: number;
  damage?: number;
  draw?: number;
  leak?: number;
}> = ({width = 520, breath = 0.5, damage = 0, draw = 1, leak = 0}) => {
  const frame = useCurrentFrame();
  const wobble = Math.sin(frame / 16) * 0.004;
  const scale = 1 + breath * 0.035 + wobble;
  const healthy = 1 - damage;
  const edge = damage > 0.5 ? C.pink : C.cyan;

  return (
    <svg
      width={width}
      height={width * 1.18}
      viewBox="0 0 600 708"
      style={{
        overflow: 'visible',
        transform: `scale(${scale})`,
        filter: `drop-shadow(0 0 ${34 + breath * 26}px ${edge}44)`,
      }}
    >
      <defs>
        <linearGradient id="lungFill" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={damage > 0.5 ? '#FF6B8A' : '#6FE8FF'} stopOpacity={0.3} />
          <stop offset="55%" stopColor={damage > 0.5 ? '#8C2238' : '#1D7FB8'} stopOpacity={0.26} />
          <stop offset="100%" stopColor="#061424" stopOpacity={0.55} />
        </linearGradient>
        <linearGradient id="lungRim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={edge} stopOpacity={0.95} />
          <stop offset="100%" stopColor={edge} stopOpacity={0.25} />
        </linearGradient>
        <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="dmgGlow">
          <stop offset="0%" stopColor={C.pink} stopOpacity="0.55" />
          <stop offset="100%" stopColor={C.pink} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* trachea */}
      <g filter="url(#softGlow)">
        <path
          d="M300 18 L300 150"
          stroke={edge}
          strokeWidth={14}
          strokeLinecap="round"
          opacity={0.55}
        />
        <path
          d="M300 18 L300 150"
          stroke="#CFF6FF"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.7}
        />
        {[
          'M300 150 C282 196 244 212 214 246',
          'M300 150 C318 196 356 212 386 246',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            stroke={edge}
            strokeWidth={9}
            fill="none"
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}
      </g>

      {/* lung bodies */}
      {[
        'M295 200 C243 205 199 242 177 306 C155 372 152 456 178 526 C196 576 241 600 273 576 C297 558 300 516 300 472 L300 200 Z',
        'M305 200 C357 205 401 242 423 306 C445 372 448 456 422 526 C404 576 359 600 327 576 C303 558 300 516 300 472 L300 200 Z',
      ].map((d, i) => (
        <g key={i}>
          <path
            d={d}
            fill="url(#lungFill)"
            stroke="url(#lungRim)"
            strokeWidth={2.6}
            strokeDasharray={2000}
            strokeDashoffset={2000 * (1 - draw)}
          />
          {damage > 0.15 ? (
            <path
              d={d}
              fill="url(#dmgGlow)"
              opacity={interpolate(damage, [0.15, 1], [0, 0.55])}
            />
          ) : null}
        </g>
      ))}

      {/* bronchial tree inside lungs */}
      <g
        stroke={edge}
        fill="none"
        strokeLinecap="round"
        opacity={0.62 * draw}
        filter="url(#softGlow)"
      >
        {[
          'M214 246 C210 300 206 350 210 410',
          'M214 246 C186 286 176 330 176 372',
          'M210 330 C232 356 246 392 250 430',
          'M210 410 C226 448 236 480 240 512',
          'M386 246 C390 300 394 350 390 410',
          'M386 246 C414 286 424 330 424 372',
          'M390 330 C368 356 354 392 350 430',
          'M390 410 C374 448 364 480 360 512',
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            strokeWidth={i % 2 === 0 ? 3.2 : 2}
            strokeDasharray={400}
            strokeDashoffset={400 * (1 - draw)}
          />
        ))}
      </g>

      {/* alveoli speckles */}
      <g opacity={0.55 * healthy}>
        {new Array(26).fill(0).map((_, i) => {
          const side = i % 2 === 0 ? 1 : -1;
          const cx = 300 + side * (38 + ((i * 37) % 92));
          const cy = 300 + ((i * 53) % 220);
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={2.6 + (i % 3)}
              fill={C.cyan}
              opacity={0.5}
            />
          );
        })}
      </g>

      {/* leak particles */}
      {leak > 0
        ? new Array(10).fill(0).map((_, i) => {
            const p = ((frame / 34 + i / 10) % 1);
            const x = 300 + Math.sin(i * 2.1 + frame / 26) * (26 + p * 90);
            const y = 560 + p * 130;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r={3.4 * (1 - p)}
                fill={C.cyan}
                opacity={leak * (1 - p) * 0.85}
              />
            );
          })
        : null}

      {/* airway airflow dashes */}
      <g stroke={C.white} strokeWidth={2} opacity={0.5} strokeLinecap="round">
        {new Array(6).fill(0).map((_, i) => {
          const p = ((frame / 60 + i / 6) % 1);
          return (
            <line
              key={i}
              x1={300}
              y1={30 + p * 96}
              x2={300}
              y2={38 + p * 96}
              opacity={0.15 + 0.6 * Math.sin(p * Math.PI)}
            />
          );
        })}
      </g>
    </svg>
  );
};

export const AlveoliCluster: React.FC<{
  width?: number;
  damage?: number;
  breath?: number;
  showFibers?: boolean;
}> = ({width = 520, damage = 0, breath = 0.5, showFibers = true}) => {
  const frame = useCurrentFrame();
  const expand = 1 + breath * 0.05;
  const healthy = Math.max(0, 1 - damage * 1.9);
  const sick = Math.min(1, Math.max(0, (damage - 0.25) * 1.7));
  const rnd = (n: number) => {
    const x = Math.sin(n * 127.1) * 43758.5453;
    return x - Math.floor(x);
  };

  const small = new Array(54).fill(0).map((_, i) => {
    const ring = Math.floor(Math.sqrt(i) * 1.6);
    const a = i * 2.399;
    const rad = 22 + ring * 26 + rnd(i) * 12;
    return {
      cx: 300 + Math.cos(a) * rad * 1.25,
      cy: 300 + Math.sin(a) * rad,
      r: 14 + rnd(i + 9) * 12,
      key: i,
    };
  });
  const big = new Array(11).fill(0).map((_, i) => {
    const a = i * 2.399;
    const rad = 26 + rnd(i + 3) * 118;
    return {
      cx: 300 + Math.cos(a) * rad * 1.15,
      cy: 300 + Math.sin(a) * rad * 0.92,
      r: 46 + rnd(i + 21) * 34,
      key: i,
    };
  });

  return (
    <svg width={width} height={width} viewBox="0 0 600 600" style={{overflow: 'visible'}}>
      <defs>
        <radialGradient id="alvGrad">
          <stop offset="0%" stopColor="#BFF6FF" stopOpacity={0.55} />
          <stop offset="62%" stopColor="#2AA6D8" stopOpacity={0.24} />
          <stop offset="100%" stopColor="#0B2C46" stopOpacity={0.1} />
        </radialGradient>
        <radialGradient id="alvSick">
          <stop offset="0%" stopColor="#8A2B3E" stopOpacity={0.5} />
          <stop offset="70%" stopColor="#3A1220" stopOpacity={0.4} />
          <stop offset="100%" stopColor="#12060C" stopOpacity={0.5} />
        </radialGradient>
      </defs>

      <g transform={`translate(300 300) scale(${expand}) translate(-300 -300)`}>
        {showFibers && healthy > 0.2 ? (
          <g opacity={0.34 * healthy} stroke={C.cyan} strokeWidth={1.2}>
            {small.map((s, i) =>
              i % 2 === 0 ? (
                <line key={i} x1={300} y1={300} x2={s.cx} y2={s.cy} />
              ) : null,
            )}
          </g>
        ) : null}

        <g opacity={healthy}>
          {small.map((s) => (
            <g key={s.key}>
              <circle
                cx={s.cx}
                cy={s.cy}
                r={s.r}
                fill="url(#alvGrad)"
                stroke={C.cyan}
                strokeWidth={1.6}
                strokeOpacity={0.65}
              />
              <circle cx={s.cx - s.r * 0.24} cy={s.cy - s.r * 0.24} r={s.r * 0.2} fill="#DFFBFF" opacity={0.35} />
            </g>
          ))}
        </g>

        <g opacity={sick}>
          {big.map((b) => (
            <g key={b.key}>
              <circle
                cx={b.cx + Math.sin(frame / 30 + b.key) * 2}
                cy={b.cy}
                r={b.r}
                fill="url(#alvSick)"
                stroke={C.pink}
                strokeWidth={1.4}
                strokeOpacity={0.4}
                strokeDasharray="7 9"
              />
            </g>
          ))}
        </g>
      </g>
    </svg>
  );
};

export const Diaphragm: React.FC<{amount?: number; color?: string}> = ({
  amount = 0.5,
  color = C.cyan,
}) => {
  const y = 40 + amount * 44;
  return (
    <svg width={620} height={150} viewBox="0 0 620 150" style={{overflow: 'visible'}}>
      <path
        d={`M20 ${y} C 160 ${y - 60}, 460 ${y - 60}, 600 ${y}`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        opacity={0.75}
        style={{filter: `drop-shadow(0 0 12px ${color})`}}
      />
      <path
        d={`M20 ${y} C 160 ${y - 60}, 460 ${y - 60}, 600 ${y} L 600 140 L 20 140 Z`}
        fill={`${color}18`}
      />
      <text x={310} y={130} fill={color} fontSize={18} textAnchor="middle" opacity={0.65} letterSpacing={6}>
        DIAPHRAGM
      </text>
    </svg>
  );
};
