import { spring } from "remotion";

export const reveal = (
  frame: number,
  fps: number,
  delay = 0,
  stiffness = 120,
  damping = 16
) =>
  spring({
    frame: frame - delay,
    fps,
    config: { stiffness, damping, mass: 0.7 },
  });

export const pop = (frame: number, fps: number, delay = 0) =>
  spring({
    frame: frame - delay,
    fps,
    config: { stiffness: 180, damping: 12, mass: 0.6 },
  });

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export const enterStyle = (p: number, dy = 26) => ({
  opacity: clamp01(p * 1.6),
  transform: `translateY(${(1 - p) * dy}px)`,
});
