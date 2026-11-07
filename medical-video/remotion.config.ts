import {Config} from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setConcurrency(3);
Config.setChromiumOpenGlRenderer('swangle');
Config.setBrowserExecutable(
  '/root/.cache/puppeteer/chrome-headless-shell/linux-155.0.8059.39/chrome-headless-shell-linux64/chrome-headless-shell',
);
Config.setCodec('h264');
Config.setCrf(20);
