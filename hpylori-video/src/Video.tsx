import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import timelineData from "./data/timeline.json";
import { Backdrop } from "./components/Backdrop";
import { Header } from "./components/Header";
import { Presenters } from "./components/Presenters";
import { Subtitle } from "./components/Subtitle";
import { HookScene, WhatScene, SpreadScene, SymptomsScene, TestScene } from "./scenes/ScenesA";
import { WhoScene, TreatScene, RecheckScene, PreventScene, OutroScene } from "./scenes/ScenesB";
import type { Scene, Speaker, Timeline } from "./types";

const timeline = timelineData as Timeline;

const SceneBody: React.FC<{ scene: Scene; durationInFrames: number }> = ({
  scene,
  durationInFrames,
}) => {
  const props = { scene, durationInFrames };
  switch (scene.id) {
    case "hook":
      return <HookScene {...props} />;
    case "what":
      return <WhatScene {...props} />;
    case "spread":
      return <SpreadScene {...props} />;
    case "symptoms":
      return <SymptomsScene {...props} />;
    case "test":
      return <TestScene {...props} />;
    case "who":
      return <WhoScene {...props} />;
    case "treat":
      return <TreatScene {...props} />;
    case "recheck":
      return <RecheckScene {...props} />;
    case "prevent":
      return <PreventScene {...props} />;
    default:
      return <OutroScene {...props} />;
  }
};

export const HpyloriVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames: totalFrames } = useVideoConfig();
  const now = frame / fps;

  const starts = timeline.scenes.map((s, i) =>
    i === 0 ? 0 : Math.max(0, Math.round(s.start * fps))
  );

  let activeSpeaker: Speaker | null = null;
  for (const scene of timeline.scenes) {
    for (const line of scene.lines) {
      if (now >= line.start - 0.05 && now <= line.end + 0.4) {
        activeSpeaker = line.speaker;
      }
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: "#041216" }}>
      <Backdrop />
      <Audio src={staticFile(timeline.voiceover)} volume={1} />

      {timeline.scenes.map((scene, i) => {
        const from = starts[i];
        const to = i < timeline.scenes.length - 1 ? starts[i + 1] : totalFrames;
        const duration = Math.max(1, to - from);
        return (
          <Sequence
            key={scene.id}
            from={from}
            durationInFrames={duration}
            premountFor={fps}
          >
            <SceneBody scene={scene} durationInFrames={duration} />
          </Sequence>
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 238,
          background:
            "linear-gradient(180deg, rgba(4,18,22,0) 0%, rgba(4,18,22,0.82) 52%, rgba(3,14,17,0.96) 100%)",
          pointerEvents: "none",
        }}
      />
      <Header timeline={timeline} />
      <Presenters activeSpeaker={activeSpeaker} />
      <Subtitle timeline={timeline} />
    </AbsoluteFill>
  );
};
