import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { T } from "../theme";

const DotGrid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage:
        "radial-gradient(rgba(120, 200, 210, 0.16) 1px, transparent 1px)",
      backgroundSize: "46px 46px",
      maskImage:
        "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,0.75), transparent 100%)",
      WebkitMaskImage:
        "radial-gradient(ellipse 75% 65% at 50% 45%, rgba(0,0,0,0.75), transparent 100%)",
      opacity: 0.55,
    }}
  />
);

export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: T.bg0,
        backgroundImage: [
          "radial-gradient(1100px 720px at 14% 8%, rgba(20, 82, 86, 0.55), transparent 62%)",
          "radial-gradient(1000px 780px at 88% 92%, rgba(18, 58, 82, 0.55), transparent 64%)",
          "linear-gradient(158deg, #041216 0%, #072028 52%, #04151a 100%)",
        ].join(","),
      }}
    >
      <DotGrid />
      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          left: 1180 + Math.sin(t * 0.18) * 40,
          top: -180 + Math.cos(t * 0.14) * 26,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(47, 211, 181, 0.13), transparent 68%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 620,
          height: 620,
          left: -220 + Math.cos(t * 0.12) * 30,
          top: 560 + Math.sin(t * 0.16) * 30,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(94, 200, 255, 0.10), transparent 68%)",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 55%, rgba(1, 8, 10, 0.55) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
