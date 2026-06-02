import React from 'react';
import Svg, { Circle, Line, Path, Polyline } from 'react-native-svg';

type IconName = 'search' | 'bag' | 'menu' | 'close' | 'check' | 'chevronRight';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Minimal stroke icon set — vector, dependency-free, tuned to the quiet UI. */
export function Icon({ name, size = 18, color = '#1d1d1f', strokeWidth = 1.6 }: Props) {
  const common = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'search' && (
        <>
          <Circle cx={11} cy={11} r={6.5} {...common} />
          <Line x1={20} y1={20} x2={16} y2={16} {...common} />
        </>
      )}
      {name === 'bag' && (
        <>
          <Path d="M6 8 H18 L17 20 H7 Z" {...common} />
          <Path d="M9 8 V6.5 A3 3 0 0 1 15 6.5 V8" {...common} />
        </>
      )}
      {name === 'menu' && (
        <>
          <Line x1={4} y1={8} x2={20} y2={8} {...common} />
          <Line x1={4} y1={16} x2={20} y2={16} {...common} />
        </>
      )}
      {name === 'close' && (
        <>
          <Line x1={6} y1={6} x2={18} y2={18} {...common} />
          <Line x1={18} y1={6} x2={6} y2={18} {...common} />
        </>
      )}
      {name === 'check' && <Polyline points="5,12 10,17 19,7" {...common} />}
      {name === 'chevronRight' && <Polyline points="9,5 16,12 9,19" {...common} />}
    </Svg>
  );
}
