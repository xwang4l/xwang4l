import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {TL} from '../timeline';

const Waveform: React.FC<{color: string; active: boolean}> = ({color, active}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 4, height: 24}}>
      {[0, 1, 2, 3, 4].map((i) => {
        const h = active ? 6 + Math.abs(Math.sin(frame / 5 + i * 0.9)) * 18 : 4;
        return (
          <div
            key={i}
            style={{
              width: 4,
              height: h,
              borderRadius: 2,
              background: color,
              boxShadow: `0 0 8px ${color}`,
              opacity: active ? 0.95 : 0.35,
            }}
          />
        );
      })}
    </div>
  );
};

export const Hud: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;
  const active = TL.lines.find((l) => t >= l.start - 0.1 && t <= l.end + 0.3);
  const color = active?.speaker === 'F' ? C.pink : C.cyan;
  const progress = Math.min(1, frame / (durationInFrames - 1));
  const mm = String(Math.floor(t / 60)).padStart(2, '0');
  const ss = String(Math.floor(t % 60)).padStart(2, '0');

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: 42,
          left: 64,
          right: 64,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              border: `1px solid ${C.cyan}66`,
              background: 'linear-gradient(150deg, rgba(52,228,255,0.22), rgba(5,16,30,0.6))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: `0 0 30px ${C.cyan}33`,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 3v7M12 10c0-2.2-1.8-4-4-4-2.8 0-4.4 2.8-4.4 6.2 0 3.7 1.7 6.8 3.4 6.8 1.9 0 2.4-1.7 2.4-3.5V10M12 10c0-2.2 1.8-4 4-4 2.8 0 4.4 2.8 4.4 6.2 0 3.7-1.7 6.8-3.4 6.8-1.9 0-2.4-1.7-2.4-3.5V10"
                stroke={C.cyan}
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 25,
                fontWeight: 900,
                color: C.white,
                letterSpacing: 3,
              }}
            >
              呼吸研究所
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 12,
                letterSpacing: 5,
                color: C.dim,
                marginTop: 2,
              }}
            >
              PULMONOLOGY LAB
            </div>
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <Waveform color={color} active={!!active} />
            <div
              style={{
                fontFamily: FONT,
                fontSize: 20,
                letterSpacing: 3,
                color,
                fontWeight: 700,
              }}
            >
              {active?.speaker === 'M' ? '男声' : '女声'}
            </div>
          </div>
          <div style={{width: 1, height: 26, background: 'rgba(120,180,220,0.25)'}} />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 19,
              letterSpacing: 3,
              color: C.dim,
              fontWeight: 600,
            }}
          >
            EP.01 · 肺气肿
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: 19,
              color: C.text,
              opacity: 0.8,
              letterSpacing: 1,
            }}
          >
            {mm}:{ss}
          </div>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 4,
          background: 'rgba(90,150,200,0.12)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${C.teal}, ${C.cyan}, ${C.violet})`,
            boxShadow: `0 0 18px ${C.cyan}cc`,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
