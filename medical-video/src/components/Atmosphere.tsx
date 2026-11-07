import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export const rand = (seed: number) => {
  let t = seed + 0x6d2b79f5;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
};

export const Particles: React.FC<{
  count?: number;
  color?: string;
  speed?: number;
  seed?: number;
  opacity?: number;
}> = ({count = 34, color = C.cyan, speed = 1, seed = 7, opacity = 0.5}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const rnd = rand(seed);
  const items = React.useMemo(
    () =>
      new Array(count).fill(0).map((_, i) => ({
        x: rnd() * width,
        y: rnd() * height,
        r: 0.8 + rnd() * 2.6,
        v: 0.25 + rnd() * 0.95,
        phase: rnd() * Math.PI * 2,
        drift: (rnd() - 0.5) * 22,
        key: i,
      })),
    [count, width, height],
  );
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {items.map((p) => {
        const y = ((p.y - frame * p.v * speed) % height + height) % height;
        const x = p.x + Math.sin(frame / 45 + p.phase) * p.drift;
        const tw = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(frame / 18 + p.phase));
        return (
          <div
            key={p.key}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.r * 2,
              height: p.r * 2,
              borderRadius: '50%',
              background: color,
              opacity: tw * opacity,
              boxShadow: `0 0 ${p.r * 6}px ${color}`,
              filter: 'blur(0.4px)',
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const GridFloor: React.FC<{opacity?: number; color?: string}> = ({
  opacity = 0.16,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: '-20%',
          right: '-20%',
          bottom: '-18%',
          height: '58%',
          backgroundImage: `linear-gradient(${color}33 1px, transparent 1px), linear-gradient(90deg, ${color}33 1px, transparent 1px)`,
          backgroundSize: '90px 90px',
          transform: 'perspective(700px) rotateX(64deg)',
          transformOrigin: 'center bottom',
          opacity,
          maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 78%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent 78%)',
          backgroundPosition: `0px ${frame * 0.7}px`,
        }}
      />
    </AbsoluteFill>
  );
};

export const GlobalBackground: React.FC<{tint?: string}> = ({tint = C.cyan}) => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  return (
    <AbsoluteFill style={{backgroundColor: C.bg, overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          inset: -200,
          background: `
            radial-gradient(900px 700px at ${50 + Math.sin(t * 0.15) * 8}% ${12 + Math.cos(t * 0.2) * 6}%, ${tint}24 0%, transparent 62%),
            radial-gradient(1100px 800px at ${82 + Math.cos(t * 0.12) * 5}% ${78 + Math.sin(t * 0.17) * 4}%, ${C.violet}1c 0%, transparent 60%),
            radial-gradient(900px 900px at 10% 92%, ${C.pink}14 0%, transparent 58%),
            linear-gradient(150deg, #050D1C 0%, #03070F 58%, #050A14 100%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.5,
          backgroundImage:
            'radial-gradient(rgba(120,190,240,0.10) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 40%, black 0%, transparent 78%)',
        }}
      />
      <GridFloor />
      <Particles seed={13} count={30} opacity={0.34} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 50% 45%, transparent 42%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const ScanSweep: React.FC<{delay?: number; color?: string}> = ({
  delay = 0,
  color = C.cyan,
}) => {
  const frame = useCurrentFrame();
  const local = frame - delay;
  if (local < 0) return null;
  const y = interpolate(local % 150, [0, 150], [-10, 110]);
  return (
    <AbsoluteFill style={{pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `${y}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${color}00, ${color}cc, ${color}00, transparent)`,
          opacity: 0.35,
          filter: 'blur(1px)',
        }}
      />
    </AbsoluteFill>
  );
};

export const GlowOrb: React.FC<{
  x: number | string;
  y: number | string;
  size: number;
  color?: string;
  opacity?: number;
  pulse?: number;
}> = ({x, y, size, color = C.cyan, opacity = 0.4, pulse = 0}) => {
  const frame = useCurrentFrame();
  const s = 1 + Math.sin(frame / (18 + pulse * 4)) * 0.06;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color}66 0%, ${color}18 45%, transparent 70%)`,
        opacity,
        transform: `scale(${s})`,
        filter: 'blur(10px)',
        pointerEvents: 'none',
      }}
    />
  );
};
