import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

/** Fades a block in/out between two local frames. */
export const Beat: React.FC<{
  start: number;
  end: number;
  enter?: number;
  exit?: number;
  rise?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({start, end, enter = 14, exit = 12, rise = 34, children, style}) => {
  const frame = useCurrentFrame();
  if (frame < start - 1 || frame > end + 1) return null;
  const opacity = interpolate(
    frame,
    [start, start + enter, end - exit, end],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const y = interpolate(frame, [start, start + enter], [rise, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{opacity, ...style}}>
      <div style={{transform: `translateY(${y}px)`, width: '100%', height: '100%'}}>
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Absolute-position helper for scene content. */
export const At: React.FC<{
  x: number;
  y: number;
  width?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, width, children, style}) => (
  <div style={{position: 'absolute', left: x, top: y, width, ...style}}>{children}</div>
);
