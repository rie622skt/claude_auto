import React from 'react';
import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';
import { Accessory } from '../data/catalog';

/**
 * Vector "product crop" for an accessory card. No photography pipeline here, so
 * each accessory kind is rendered as a clean, centered, recognizable silhouette
 * on a neutral surface — the product itself carries the implied weight.
 */
export function AccessoryArt({ accessory, size }: { accessory: Accessory; size: number }) {
  const c = accessory.hex;
  const VB = 100;
  const scale = { width: size, height: size };

  return (
    <Svg {...scale} viewBox={`0 0 ${VB} ${VB}`}>
      {accessory.kind === 'band' && (
        <>
          {/* coiled band: a thick ring + small buckle */}
          <Circle cx={50} cy={50} r={28} fill="none" stroke={c} strokeWidth={13} />
          <Circle cx={50} cy={50} r={28} fill="none" stroke="#000" strokeOpacity={0.08} strokeWidth={1} />
          <Rect x={46} y={16} width={8} height={12} rx={2} fill={c} />
          <Rect x={47.5} y={18} width={5} height={3} rx={1.5} fill="#000" fillOpacity={0.25} />
        </>
      )}

      {accessory.kind === 'charger' && (
        <>
          {/* puck + cable */}
          <Circle cx={50} cy={42} r={22} fill={c} stroke="#000" strokeOpacity={0.08} strokeWidth={1} />
          <Circle cx={50} cy={42} r={9} fill="#000" fillOpacity={0.06} />
          <Path d="M50 64 q0 18 14 24" fill="none" stroke={c} strokeWidth={6} strokeLinecap="round" />
        </>
      )}

      {accessory.kind === 'case' && (
        <>
          {/* bumper frame, watch-shaped */}
          <Rect x={30} y={20} width={40} height={60} rx={16} fill="none" stroke={c} strokeWidth={9} />
          <Rect x={68} y={40} width={6} height={16} rx={3} fill={c} />
        </>
      )}

      {accessory.kind === 'dock' && (
        <>
          {/* nightstand dock: base + upright + disk */}
          <Rect x={26} y={70} width={48} height={10} rx={4} fill={c} />
          <Rect x={46} y={40} width={8} height={32} rx={3} fill={c} />
          <Circle cx={50} cy={36} r={14} fill={c} stroke="#000" strokeOpacity={0.08} strokeWidth={1} />
          <Circle cx={50} cy={36} r={6} fill="#000" fillOpacity={0.06} />
        </>
      )}
    </Svg>
  );
}
