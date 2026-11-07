import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setBrowserExecutable(
  "/workspace/hpylori-video/.cache/chrome-headless-shell-linux64/chrome-headless-shell"
);
Config.setChromiumOpenGlRenderer("angle");
Config.setConcurrency(3);
Config.setCodec("h264");
