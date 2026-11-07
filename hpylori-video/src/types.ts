export type Speaker = "M" | "F";

export type Line = {
  speaker: Speaker;
  text: string;
  start: number;
  end: number;
  audio: string;
};

export type Scene = {
  id: string;
  label: string;
  title: string;
  start: number;
  end: number;
  lines: Line[];
};

export type Timeline = {
  fps: number;
  sampleRate: number;
  durationInSeconds: number;
  totalFrames: number;
  voiceover: string;
  wordCount: number;
  scenes: Scene[];
};
