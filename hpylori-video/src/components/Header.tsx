import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "../theme";
import type { Timeline } from "../types";

export const Header: React.FC<{ timeline: Timeline }> = ({ timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const active =
    timeline.scenes.findIndex((s) => t >= s.start && t < s.end) ?? 0;
  const idx = active < 0 ? timeline.scenes.length - 1 : active;
  const progress = Math.min(1, t / timeline.durationInSeconds);

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 4,
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${T.teal}, ${T.male})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 92,
          right: 92,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: T.font,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              border: `1.5px solid ${T.borderStrong}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: T.tealDim,
            }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21c4.4 0 8-3.4 8-7.6 0-5.2-8-11.4-8-11.4S4 8.2 4 13.4C4 17.6 7.6 21 12 21Z"
                stroke={T.teal}
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M8.6 13.6c1.4-.5 2.2.4 2.6 1.6.4 1.2 1.3 2 2.8 1.6"
                stroke={T.teal}
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontSize: 21,
                letterSpacing: 2.5,
                color: T.text,
                fontWeight: 700,
              }}
            >
              胃里那点事
            </div>
            <div style={{ fontSize: 14, color: T.dim, letterSpacing: 1.6 }}>
              医学科普 · 幽门螺杆菌
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 26 }}>
          <div
            style={{
              fontSize: 17,
              color: T.muted,
              letterSpacing: 1.4,
              padding: "9px 18px",
              borderRadius: 999,
              border: `1px solid ${T.border}`,
              background: "rgba(8, 30, 36, 0.6)",
            }}
          >
            {timeline.scenes[idx].label} · {timeline.scenes[idx].title}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {timeline.scenes.map((s, i) => (
              <div
                key={s.id}
                style={{
                  width: i === idx ? 34 : 12,
                  height: 5,
                  borderRadius: 99,
                  background: i <= idx ? T.teal : "rgba(147, 180, 178, 0.25)",
                  opacity: i === idx ? 1 : 0.65,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
