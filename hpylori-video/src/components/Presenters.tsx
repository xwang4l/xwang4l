import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { T, speakerColor } from "../theme";
import type { Speaker } from "../types";

const MaleAvatar: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="50" fill="#0C2C35" />
    <path
      d="M13 100C15 79 30 68 50 68C70 68 85 79 87 100Z"
      fill="#1F6B78"
    />
    <path d="M43 58H57V71H43Z" fill="#E8B78E" />
    <path
      d="M43 71C43 76 46 79 50 79C54 79 57 76 57 71Z"
      fill="#DCA87F"
    />
    <ellipse cx="50" cy="45" rx="17.5" ry="19.5" fill="#F2C69D" />
    <path
      d="M32.5 45C31.5 26 40 19 50 19C61 19 68.5 27 67.5 45C64 35.5 59 30.5 50 30.5C41 30.5 35.5 35.5 32.5 45Z"
      fill="#1B2B33"
    />
    <circle cx="43.2" cy="46" r="2" fill="#22333A" />
    <circle cx="56.8" cy="46" r="2" fill="#22333A" />
    <path
      d="M44.5 54.5C47 57 53 57 55.5 54.5"
      stroke="#B4735B"
      strokeWidth="1.9"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const FemaleAvatar: React.FC = () => (
  <svg viewBox="0 0 100 100" width="100%" height="100%">
    <circle cx="50" cy="50" r="50" fill="#2A1B25" />
    <path
      d="M28 46C24 68 26 84 30 100H70C74 84 76 68 72 46Z"
      fill="#2C2029"
    />
    <path
      d="M13 100C15 80 30 69 50 69C70 69 85 80 87 100Z"
      fill="#B85066"
    />
    <path d="M43.5 59H56.5V72H43.5Z" fill="#E9B98F" />
    <path
      d="M43.5 72C43.5 77 46.4 80 50 80C53.6 80 56.5 77 56.5 72Z"
      fill="#DCA87F"
    />
    <ellipse cx="50" cy="45.5" rx="17" ry="19" fill="#F4CBA3" />
    <path
      d="M30.5 47C28.5 28 37 18 50 18C63 18 71.5 28 69.5 47C66 37 60 31 50 31C40 31 34 37 30.5 47Z"
      fill="#241A22"
    />
    <circle cx="43.5" cy="46.5" r="2" fill="#2A2A33" />
    <circle cx="56.5" cy="46.5" r="2" fill="#2A2A33" />
    <path
      d="M45 55C47.2 57.4 52.8 57.4 55 55"
      stroke="#C07A68"
      strokeWidth="1.9"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="32" cy="55" r="2.4" fill={T.amber} opacity="0.9" />
    <circle cx="68" cy="55" r="2.4" fill={T.amber} opacity="0.9" />
  </svg>
);

const Wave: React.FC<{ color: string; active: boolean }> = ({
  color,
  active,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3.5, height: 26 }}>
      {[0, 1, 2, 3].map((i) => {
        const h = active
          ? 7 + Math.abs(Math.sin(t * 7.5 + i * 1.7)) * 18
          : 6;
        return (
          <div
            key={i}
            style={{
              width: 3.5,
              height: h,
              borderRadius: 4,
              background: color,
              opacity: active ? 0.95 : 0.28,
            }}
          />
        );
      })}
    </div>
  );
};

const Presenter: React.FC<{
  speaker: Speaker;
  active: boolean;
  align: "left" | "right";
}> = ({ speaker, active, align }) => {
  const color = speakerColor(speaker);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        flexDirection: align === "left" ? "row" : "row-reverse",
      }}
    >
      <div
        style={{
          width: 92,
          height: 92,
          borderRadius: "50%",
          overflow: "hidden",
          border: `2.5px solid ${active ? color : "rgba(147,180,178,0.22)"}`,
          boxShadow: active ? `0 0 0 6px ${color}18, 0 0 34px ${color}38` : "none",
          opacity: active ? 1 : 0.62,
          transition: "none",
        }}
      >
        {speaker === "M" ? <MaleAvatar /> : <FemaleAvatar />}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: align === "left" ? "flex-start" : "flex-end",
          gap: 7,
          opacity: active ? 1 : 0.6,
        }}
      >
        <div
          style={{
            fontFamily: T.font,
            fontWeight: 700,
            fontSize: 21,
            color: active ? color : T.muted,
            letterSpacing: 1,
          }}
        >
          {speaker === "M" ? "阿哲" : "小林"}
        </div>
        <Wave color={color} active={active} />
      </div>
    </div>
  );
};

export const Presenters: React.FC<{ activeSpeaker: Speaker | null }> = ({
  activeSpeaker,
}) => (
  <>
    <div style={{ position: "absolute", left: 92, bottom: 46 }}>
      <Presenter speaker="M" active={activeSpeaker === "M"} align="left" />
    </div>
    <div style={{ position: "absolute", right: 92, bottom: 46 }}>
      <Presenter speaker="F" active={activeSpeaker === "F"} align="right" />
    </div>
  </>
);
