import React from 'react';
import Svg, { Circle, Line, Path, Polyline, Rect } from 'react-native-svg';

export type IconName =
  | 'play'
  | 'pause'
  | 'gear'
  | 'chart'
  | 'clock'
  | 'close'
  | 'check'
  | 'chevronLeft'
  | 'chevronRight';

type Props = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Minimal stroke icon set — vector, dependency-free, tuned to the quiet UI. */
export function Icon({ name, size = 18, color = '#1d1d1f', strokeWidth = 1.6 }: Props) {
  const s = {
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    fill: 'none',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {name === 'play' && <Path d="M8 5.5 L18 12 L8 18.5 Z" fill={color} stroke={color} strokeLinejoin="round" />}
      {name === 'pause' && (
        <>
          <Rect x={7} y={5.5} width={3.2} height={13} rx={1.2} fill={color} />
          <Rect x={13.8} y={5.5} width={3.2} height={13} rx={1.2} fill={color} />
        </>
      )}
      {name === 'gear' && (
        <>
          <Circle cx={12} cy={12} r={3} {...s} />
          <Path
            d="M12 2.8 v2.2 M12 19 v2.2 M2.8 12 h2.2 M19 12 h2.2 M5.4 5.4 l1.6 1.6 M17 17 l1.6 1.6 M18.6 5.4 l-1.6 1.6 M7 17 l-1.6 1.6"
            {...s}
          />
        </>
      )}
      {name === 'chart' && (
        <>
          <Line x1={6} y1={20} x2={6} y2={13} {...s} />
          <Line x1={12} y1={20} x2={12} y2={8} {...s} />
          <Line x1={18} y1={20} x2={18} y2={11} {...s} />
        </>
      )}
      {name === 'clock' && (
        <>
          <Circle cx={12} cy={12} r={8} {...s} />
          <Polyline points="12,7.5 12,12 15.5,13.8" {...s} />
        </>
      )}
      {name === 'close' && (
        <>
          <Line x1={6} y1={6} x2={18} y2={18} {...s} />
          <Line x1={18} y1={6} x2={6} y2={18} {...s} />
        </>
      )}
      {name === 'check' && <Polyline points="5,12 10,17 19,7" {...s} />}
      {name === 'chevronLeft' && <Polyline points="15,5 8,12 15,19" {...s} />}
      {name === 'chevronRight' && <Polyline points="9,5 16,12 9,19" {...s} />}
    </Svg>
  );
}
