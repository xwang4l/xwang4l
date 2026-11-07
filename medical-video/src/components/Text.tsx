import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

export const Pop: React.FC<{
  delay?: number;
  children: React.ReactNode;
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
  distance?: number;
  damping?: number;
  style?: React.CSSProperties;
}> = ({delay = 0, children, from = 'up', distance = 42, damping = 200, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping, mass: 0.7, stiffness: 110}});
  const x = from === 'left' ? -distance : from === 'right' ? distance : 0;
  const y = from === 'up' ? distance : from === 'down' ? -distance : 0;
  const scale = from === 'scale' ? 0.86 + p * 0.14 : 1;
  return (
    <div
      style={{
        opacity: p,
        transform: `translate(${(1 - p) * x}px, ${(1 - p) * y}px) scale(${scale})`,
        filter: `blur(${(1 - p) * 6}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Kicker: React.FC<{
  children: React.ReactNode;
  color?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({children, color = C.cyan, delay = 0, style}) => {
  const frame = useCurrentFrame();
  const grow = Math.min(1, Math.max(0, (frame - delay) / 14));
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 16, ...style}}>
      <div
        style={{
          width: 46 * grow,
          height: 3,
          background: color,
          boxShadow: `0 0 16px ${color}`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: 26,
          letterSpacing: 8,
          color,
          fontWeight: 700,
          opacity: grow,
          textTransform: 'uppercase',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const SectionTitle: React.FC<{
  index: string;
  title: string;
  en?: string;
  delay?: number;
  color?: string;
}> = ({index, title, en = '', delay = 0, color = C.cyan}) => {
  return (
    <div style={{display: 'flex', alignItems: 'flex-end', gap: 26}}>
      <Pop delay={delay} from="left">
        <div
          style={{
            fontFamily: FONT,
            fontSize: 120,
            fontWeight: 900,
            lineHeight: 0.8,
            color: 'transparent',
            WebkitTextStroke: `2px ${color}88`,
            letterSpacing: -4,
          }}
        >
          {index}
        </div>
      </Pop>
      <div style={{paddingBottom: 10}}>
        <Pop delay={delay + 3} from="up" distance={26}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 56,
              fontWeight: 900,
              color: C.white,
              letterSpacing: 2,
              textShadow: `0 0 40px ${color}55`,
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
        </Pop>
        {en ? (
          <Pop delay={delay + 7} from="up" distance={18}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 20,
                letterSpacing: 7,
                color: C.dim,
                marginTop: 6,
              }}
            >
              {en}
            </div>
          </Pop>
        ) : null}
      </div>
    </div>
  );
};

export const GlowText: React.FC<{
  children: React.ReactNode;
  color?: string;
  size?: number;
  weight?: number;
  style?: React.CSSProperties;
}> = ({children, color = C.white, size = 64, weight = 900, style}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      color,
      letterSpacing: 2,
      textShadow: `0 0 34px ${C.cyan}55, 0 0 8px rgba(255,255,255,0.25)`,
      lineHeight: 1.18,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  filled?: boolean;
  size?: number;
  style?: React.CSSProperties;
}> = ({children, color = C.cyan, filled = false, size = 26, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '9px 20px',
      borderRadius: 999,
      border: `1px solid ${color}66`,
      background: filled ? `${color}22` : 'rgba(8,20,34,0.5)',
      color,
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: 2,
      boxShadow: `0 0 26px ${color}22`,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Divider: React.FC<{width?: number; color?: string; delay?: number}> = ({
  width = 380,
  color = C.cyan,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const g = Math.min(1, Math.max(0, (frame - delay) / 16));
  return (
    <div
      style={{
        width: width * g,
        height: 2,
        background: `linear-gradient(90deg, ${color}, ${color}00)`,
        borderRadius: 2,
      }}
    />
  );
};
