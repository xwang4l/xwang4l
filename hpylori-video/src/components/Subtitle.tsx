import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { T, speakerColor, speakerName } from "../theme";
import type { Line, Timeline } from "../types";

export const Subtitle: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  const all: Line[] = timeline.scenes.flatMap((s) => s.lines);
  let current: Line | null = null;
  let localStart = 0;
  for (const line of all) {
    if (t >= line.start - 0.08 && t <= line.end + 0.42) {
      current = line;
      localStart = (t - line.start) * fps;
    }
    if (t > line.end + 0.42) current = null;
  }

  if (!current) return null;
  const color = speakerColor(current.speaker);
  const appear = interpolate(localStart, [0, 7], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 400,
        right: 400,
        bottom: 34,
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "16px 28px 16px 22px",
        borderRadius: 18,
        background:
          "linear-gradient(90deg, rgba(6, 24, 29, 0.93), rgba(8, 32, 39, 0.88))",
        border: `1px solid ${T.border}`,
        borderLeft: `4px solid ${color}`,
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.35)",
        opacity: appear,
        transform: `translateY(${(1 - appear) * 10}px)`,
      }}
    >
      <div
        style={{
          fontFamily: T.font,
          fontSize: 17,
          fontWeight: 700,
          color: color,
          letterSpacing: 1,
          whiteSpace: "nowrap",
          padding: "5px 12px",
          borderRadius: 8,
          background: `${color}18`,
        }}
      >
        {speakerName(current.speaker)}
      </div>
      <div
        style={{
          fontFamily: T.font,
          fontSize: 33,
          lineHeight: 1.42,
          color: T.text,
          letterSpacing: 0.3,
          fontWeight: 500,
        }}
      >
        {current.text}
      </div>
    </div>
  );
};
