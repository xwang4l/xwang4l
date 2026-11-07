import raw from './data/timeline.json';

export type Word = {text: string; start: number; end: number};
export type Line = {
  id: string;
  scene: string;
  speaker: 'M' | 'F';
  text: string;
  emphasis: string[];
  start: number;
  duration: number;
  end: number;
  words: Word[];
};
export type Scene = {id: string; name: string; start: number; end: number};
export type Timeline = {
  title: string;
  subtitle: string;
  fps: number;
  width: number;
  height: number;
  totalDuration: number;
  durationInFrames: number;
  scenes: Scene[];
  lines: Line[];
};

export const TL = raw as Timeline;
export const FPS = TL.fps;
export const W = TL.width;
export const H = TL.height;
export const TOTAL_FRAMES = TL.durationInFrames;

export const toFrame = (sec: number) => Math.round(sec * FPS);

export const sceneById = (id: string): Scene => TL.scenes.find((s) => s.id === id)!;

export const sceneFrames = (id: string) => {
  const s = sceneById(id);
  const from = toFrame(s.start);
  return {from, duration: Math.max(1, toFrame(s.end) - from)};
};

export const linesOf = (id: string): Line[] => TL.lines.filter((l) => l.scene === id);

/** Local frame at which a line starts inside its scene. */
export const beat = (sceneId: string, lineId: string): number => {
  const scene = sceneById(sceneId);
  const line = TL.lines.find((l) => l.id === lineId)!;
  return toFrame(line.start) - toFrame(scene.start);
};

/** Local [start,end] of a line inside its scene. */
export const beatRange = (sceneId: string, lineId: string): [number, number] => {
  const scene = sceneById(sceneId);
  const line = TL.lines.find((l) => l.id === lineId)!;
  const base = toFrame(scene.start);
  return [toFrame(line.start) - base, toFrame(line.end) - base];
};

/** The most recent line id active at a local frame (falls back to first). */
export const activeLine = (sceneId: string, localFrame: number): string => {
  const scene = sceneById(sceneId);
  const f = localFrame + toFrame(scene.start);
  const active = TL.lines.filter(
    (l) => l.scene === sceneId && toFrame(l.start) <= f,
  );
  return (active[active.length - 1] ?? linesOf(sceneId)[0]).id;
};
