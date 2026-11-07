import { Composition } from "remotion";
import timeline from "./data/timeline.json";
import { HpyloriVideo } from "./Video";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HpyloriVideo"
      component={HpyloriVideo}
      durationInFrames={timeline.totalFrames}
      fps={timeline.fps}
      width={1920}
      height={1080}
    />
  );
};
