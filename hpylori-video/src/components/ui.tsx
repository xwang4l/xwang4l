import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "../theme";
import type { Scene } from "../types";

export const SceneShell: React.FC<{
  scene: Scene;
  durationInFrames: number;
  children: React.ReactNode;
}> = ({ scene, durationInFrames, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const titleIn = interpolate(frame, [2, 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        padding: "126px 96px 232px",
        display: "flex",
        flexDirection: "column",
        opacity: Math.min(fadeIn, fadeOut),
        fontFamily: T.font,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 12}px)`,
        }}
      >
        <div
          style={{
            width: 34,
            height: 3,
            borderRadius: 2,
            background: T.teal,
          }}
        />
        <div
          style={{
            fontSize: 19,
            letterSpacing: 3.5,
            color: T.teal,
            fontWeight: 700,
          }}
        >
          {scene.label}
        </div>
      </div>
      <div
        style={{
          fontSize: 56,
          fontWeight: 900,
          color: T.text,
          letterSpacing: 1.5,
          marginTop: 12,
          opacity: titleIn,
          transform: `translateY(${(1 - titleIn) * 16}px)`,
          lineHeight: 1.18,
        }}
      >
        {scene.title}
      </div>
      <div
        style={{
          height: 575,
          flex: "none",
          position: "relative",
          marginTop: 26,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        <div style={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export const Panel: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  accent?: string;
}> = ({ children, style, accent }) => (
  <div
    style={{
      borderRadius: 22,
      background:
        "linear-gradient(180deg, rgba(14, 45, 53, 0.9), rgba(8, 30, 36, 0.86))",
      border: `1px solid ${accent ? `${accent}55` : T.border}`,
      boxShadow: "0 18px 50px rgba(0, 0, 0, 0.28)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip: React.FC<{
  children: React.ReactNode;
  color?: string;
  bg?: string;
  style?: React.CSSProperties;
}> = ({ children, color = T.text, bg, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 18px",
      borderRadius: 999,
      fontSize: 24,
      color,
      background: bg ?? "rgba(255,255,255,0.05)",
      border: `1px solid ${color}33`,
      fontWeight: 500,
      ...style,
    }}
  >
    {children}
  </div>
);

type IconName =
  | "chopsticks"
  | "wash"
  | "home"
  | "family"
  | "flask"
  | "scope"
  | "tube"
  | "shield"
  | "pill"
  | "capsule"
  | "alert"
  | "check"
  | "clock"
  | "food"
  | "baby"
  | "water"
  | "ban"
  | "stomach"
  | "drop";

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({ name, size = 40, color = T.teal, strokeWidth = 1.7 }) => {
  const common = {
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<IconName, React.ReactNode> = {
    chopsticks: (
      <>
        <path d="M4 4l10 12M8 3l10 12" {...common} />
        <path d="M4 20h16c0-3-3.6-5-8-5s-8 2-8 5Z" {...common} />
        <path d="M10 6l1 2M13 5l1 2" {...common} />
      </>
    ),
    wash: (
      <>
        <path d="M12 3c0 0-5 5.6-5 9a5 5 0 0 0 10 0c0-3.4-5-9-5-9Z" {...common} />
        <path d="M3 21c1.6-1.4 3.2-1.4 4.8 0 1.6 1.3 3.2 1.3 4.8 0 1.6-1.4 3.2-1.4 4.8 0 1.5 1.2 3 1.2 4.4.1" {...common} />
      </>
    ),
    home: (
      <>
        <path d="M3 11.2 12 3.5l9 7.7V21H3V11.2Z" {...common} />
        <path d="M9.5 21v-6h5v6" {...common} />
      </>
    ),
    family: (
      <>
        <circle cx="8" cy="8" r="3" {...common} />
        <circle cx="16.5" cy="9" r="2.4" {...common} />
        <path d="M2.8 20c0-3.2 2.4-5.4 5.4-5.4s5.4 2.2 5.4 5.4" {...common} />
        <path d="M14 20c0-2.6 1.4-4.4 3.6-4.4 2 0 3.6 1.8 3.6 4.4" {...common} />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6M10 3v6l-5.2 9A2.4 2.4 0 0 0 6.9 21h10.2a2.4 2.4 0 0 0 2.1-3L14 9V3" {...common} />
        <path d="M8 15h8" {...common} />
      </>
    ),
    scope: (
      <>
        <path d="M4 5c0 8 4 12 12 12" {...common} />
        <path d="M4 5V3" {...common} />
        <circle cx="17.5" cy="17.5" r="2.5" {...common} />
        <path d="M8 8c1.6 4.4 4.4 6.6 8 7.2" {...common} />
      </>
    ),
    tube: (
      <>
        <path d="M9 3h6v15.5a3 3 0 0 1-6 0V3Z" {...common} />
        <path d="M9 10h6" {...common} />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 20 6v6c0 5-3.6 8.2-8 9.4-4.4-1.2-8-4.4-8-9.4V6l8-3Z" {...common} />
        <path d="m8.4 12 2.4 2.4 4.6-4.8" {...common} />
      </>
    ),
    pill: (
      <>
        <rect x="3" y="8.4" width="18" height="7.2" rx="3.6" transform="rotate(-35 12 12)" {...common} />
        <path d="m8.4 6.4 9.2 9.2" {...common} />
      </>
    ),
    capsule: (
      <>
        <rect x="4" y="7" width="7" height="10" rx="3.5" {...common} />
        <rect x="13" y="7" width="7" height="10" rx="3.5" {...common} />
      </>
    ),
    alert: (
      <>
        <path d="M12 3.6 21 20H3l9-16.4Z" {...common} />
        <path d="M12 9.5v4.6" {...common} />
        <circle cx="12" cy="17" r="0.9" fill={color} stroke="none" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="8.6" {...common} />
        <path d="m8.2 12 2.6 2.6 5-5.2" {...common} />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="8.6" {...common} />
        <path d="M12 7v5l3.4 2" {...common} />
      </>
    ),
    food: (
      <>
        <path d="M3 12h18c0 4.4-4 8-9 8s-9-3.6-9-8Z" {...common} />
        <path d="M7 9c-.8-1.4.8-2.2 0-3.6M12 9c-.8-1.4.8-2.2 0-3.6M17 9c-.8-1.4.8-2.2 0-3.6" {...common} />
      </>
    ),
    baby: (
      <>
        <circle cx="12" cy="8" r="4" {...common} />
        <path d="M5 21c0-3.9 3.1-6.4 7-6.4s7 2.5 7 6.4" {...common} />
      </>
    ),
    water: (
      <>
        <path d="M12 3c0 0-5 5.6-5 9a5 5 0 0 0 10 0c0-3.4-5-9-5-9Z" {...common} />
        <path d="M10 13.5c.4 1.3 1.2 2 2.4 2.2" {...common} />
      </>
    ),
    ban: (
      <>
        <circle cx="12" cy="12" r="8.6" {...common} />
        <path d="m6 6 12 12" {...common} />
      </>
    ),
    stomach: (
      <>
        <path d="M9 3v3.5c0 2-3.4 3.2-3.4 6.8 0 4.2 3.2 7.7 7.4 7.7 3.8 0 6.6-2.2 6.6-5.6 0-2.8-2.2-4.4-4.4-4.4" {...common} />
        <path d="M9 6.5c2 0 3.4 1 3.4 2.6" {...common} />
      </>
    ),
    drop: (
      <>
        <path d="M12 3c0 0-5.5 6.2-5.5 9.8a5.5 5.5 0 0 0 11 0C17.5 9.2 12 3 12 3Z" {...common} />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name]}
    </svg>
  );
};
