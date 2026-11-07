import React from 'react';

export type IconName =
  | 'smoke'
  | 'dust'
  | 'virus'
  | 'scissors'
  | 'scale'
  | 'warning'
  | 'clock'
  | 'inhaler'
  | 'oxygen'
  | 'vaccine'
  | 'check'
  | 'cross'
  | 'lungs'
  | 'chart'
  | 'pill'
  | 'arrow'
  | 'stethoscope';

export const Icon: React.FC<{
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}> = ({name, size = 42, color = 'currentColor', strokeWidth = 1.8}) => {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 48 48',
    fill: 'none',
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };
  switch (name) {
    case 'smoke':
      return (
        <svg {...common}>
          <rect x="16" y="30" width="22" height="8" rx="2" />
          <path d="M16 34h-6M38 34h4" />
          <path d="M27 26c0-4-3-4-3-8s3-4 3-8" opacity="0.8" />
          <path d="M33 26c0-3 2-3 2-6" opacity="0.55" />
          <path d="M21 26c0-3-2-3-2-6" opacity="0.55" />
        </svg>
      );
    case 'dust':
      return (
        <svg {...common}>
          <circle cx="12" cy="14" r="2.4" />
          <circle cx="28" cy="10" r="1.8" />
          <circle cx="38" cy="20" r="2.2" />
          <circle cx="20" cy="30" r="2" />
          <circle cx="33" cy="35" r="2.6" />
          <circle cx="10" cy="38" r="1.6" />
          <path d="M6 22c6-3 10 2 16-1s10 2 14-2" opacity="0.5" />
        </svg>
      );
    case 'virus':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="10" />
          <circle cx="21" cy="21" r="2" fill={color} stroke="none" />
          <circle cx="27" cy="27" r="1.6" fill={color} stroke="none" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={24 + Math.cos(r) * 10}
                y1={24 + Math.sin(r) * 10}
                x2={24 + Math.cos(r) * 15}
                y2={24 + Math.sin(r) * 15}
              />
            );
          })}
        </svg>
      );
    case 'scissors':
      return (
        <svg {...common}>
          <circle cx="15" cy="33" r="5" />
          <circle cx="15" cy="15" r="5" />
          <path d="M19 30L38 11M19 18L38 37" />
        </svg>
      );
    case 'scale':
      return (
        <svg {...common}>
          <path d="M24 8v32M14 40h20M8 16h32" />
          <path d="M8 16l-4 9a5 5 0 0010 0zM40 16l-4 9a5 5 0 0010 0z" />
          <circle cx="24" cy="8" r="2.4" />
        </svg>
      );
    case 'warning':
      return (
        <svg {...common}>
          <path d="M24 7l18 32H6z" />
          <path d="M24 19v10" />
          <circle cx="24" cy="34" r="1.6" fill={color} stroke="none" />
        </svg>
      );
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="17" />
          <path d="M24 14v11l7 4" />
        </svg>
      );
    case 'inhaler':
      return (
        <svg {...common}>
          <rect x="20" y="16" width="12" height="26" rx="4" />
          <path d="M24 16V9h8v7M26 11h4" />
          <path d="M14 24h6M20 28c-4 0-6 2-6 5" opacity="0.7" />
        </svg>
      );
    case 'oxygen':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="15" />
          <path d="M18 30c0-8 3-13 6-13s6 5 6 13" />
          <path d="M12 24h24" opacity="0.7" />
        </svg>
      );
    case 'vaccine':
      return (
        <svg {...common}>
          <path d="M30 8l10 10M34 12l-18 18-6 8 8-6 18-18" />
          <path d="M22 22l8 8" opacity="0.8" />
          <path d="M14 30l4 4" />
        </svg>
      );
    case 'check':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M16 24l6 6 11-12" />
        </svg>
      );
    case 'cross':
      return (
        <svg {...common}>
          <circle cx="24" cy="24" r="16" />
          <path d="M18 18l12 12M30 18L18 30" />
        </svg>
      );
    case 'lungs':
      return (
        <svg {...common}>
          <path d="M24 8v14M24 20c0-4-3-7-7-7-5 0-8 5-8 11 0 7 3 13 6 13 3.5 0 4.5-3 4.5-6.5V20M24 20c0-4 3-7 7-7 5 0 8 5 8 11 0 7-3 13-6 13-3.5 0-4.5-3-4.5-6.5V20" />
        </svg>
      );
    case 'chart':
      return (
        <svg {...common}>
          <path d="M7 40h34M11 34V22M20 34V12M29 34V26M38 34V17" />
        </svg>
      );
    case 'pill':
      return (
        <svg {...common}>
          <rect x="8" y="17" width="32" height="15" rx="7.5" transform="rotate(-35 24 24)" />
          <path d="M18 31L30 17" />
        </svg>
      );
    case 'arrow':
      return (
        <svg {...common}>
          <path d="M8 24h30M28 14l10 10-10 10" />
        </svg>
      );
    case 'stethoscope':
      return (
        <svg {...common}>
          <path d="M13 8v10a8 8 0 0016 0V8" />
          <path d="M21 26v6a9 9 0 0018 0v-4" />
          <circle cx="39" cy="24" r="4" />
        </svg>
      );
    default:
      return null;
  }
};
