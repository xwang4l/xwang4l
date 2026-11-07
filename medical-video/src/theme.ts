export const C = {
  bg: '#03070F',
  bg2: '#07172A',
  panel: 'rgba(10,26,44,0.66)',
  cyan: '#34E4FF',
  teal: '#1FD3B4',
  blue: '#3D8BFF',
  pink: '#FF3D6E',
  amber: '#FFC857',
  violet: '#9B6BFF',
  white: '#F2F9FF',
  text: '#D8E9FA',
  dim: '#7189A6',
};

export const FONT = '"Noto Sans CJK SC", "Noto Sans SC", "Source Han Sans SC", sans-serif';

export const glass = (opacity = 0.66, border = 'rgba(90,180,230,0.22)') => ({
  background: `linear-gradient(150deg, rgba(16,38,62,${opacity}) 0%, rgba(6,16,30,${opacity + 0.1}) 100%)`,
  border: `1px solid ${border}`,
  boxShadow: '0 24px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
  backdropFilter: 'blur(14px)',
});
