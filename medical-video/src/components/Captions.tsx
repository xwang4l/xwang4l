import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {TL, Line, toFrame} from '../timeline';

type Seg = {text: string; start: number; end: number; emphasis: boolean};

const buildSegments = (line: Line): Seg[] => {
  const segs: Seg[] = [];
  let pos = 0;
  let prevEnd = line.start;
  line.words.forEach((w) => {
    const idx = line.text.indexOf(w.text, pos);
    if (idx < 0) return;
    if (idx > pos) {
      segs.push({
        text: line.text.slice(pos, idx),
        start: prevEnd,
        end: w.start,
        emphasis: false,
      });
    }
    segs.push({
      text: w.text,
      start: w.start,
      end: w.end,
      emphasis: line.emphasis.some((e) => e.includes(w.text) || w.text.includes(e)),
    });
    pos = idx + w.text.length;
    prevEnd = w.end;
  });
  if (pos < line.text.length) {
    segs.push({text: line.text.slice(pos), start: prevEnd, end: line.end, emphasis: false});
  }
  return segs;
};

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const line = TL.lines.find((l) => t >= l.start - 0.05 && t <= l.end + 0.5);
  if (!line) return null;

  const segs = buildSegments(line);
  const appear = Math.max(0, Math.min(1, (t - line.start + 0.05) * 8));
  const isF = line.speaker === 'F';
  const accent = isF ? C.pink : C.cyan;

  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 48,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          opacity: appear,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 12,
            fontFamily: FONT,
            fontSize: 21,
            letterSpacing: 4,
            color: accent,
            opacity: 0.9,
          }}
        >
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              background: accent,
              boxShadow: `0 0 12px ${accent}`,
            }}
          />
          {isF ? '女声 · 晓晓' : '男声 · 云希'}
          <div style={{color: C.dim, letterSpacing: 2}}>
            {String(Math.floor(t / 60)).padStart(2, '0')}:
            {String(Math.floor(t % 60)).padStart(2, '0')}
          </div>
        </div>
        <div
          style={{
            maxWidth: 1460,
            padding: '16px 46px 20px',
            borderRadius: 18,
            background: 'linear-gradient(180deg, rgba(4,12,24,0.78), rgba(3,8,16,0.9))',
            border: '1px solid rgba(110,190,235,0.16)',
            boxShadow: '0 18px 60px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: 43,
              lineHeight: 1.5,
              fontWeight: 700,
              letterSpacing: 1,
              color: 'rgba(214,232,248,0.34)',
            }}
          >
            {segs.map((s, i) => {
              const spoken = t >= s.start - 0.02;
              const active = t >= s.start && t <= s.end + 0.12;
              const color = !spoken
                ? 'rgba(214,232,248,0.32)'
                : s.emphasis
                  ? active
                    ? C.amber
                    : '#FFE0A0'
                  : C.white;
              return (
                <span
                  key={i}
                  style={{
                    color,
                    textShadow: active
                      ? `0 0 22px ${s.emphasis ? C.amber : C.cyan}88`
                      : 'none',
                    transition: 'color 80ms linear',
                  }}
                >
                  {s.text}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
