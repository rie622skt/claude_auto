import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { colors, fontFamily, productShadow } from '../theme/tokens';

export type BandStyle = 'solid' | 'sport' | 'woven' | 'link';
export type WatchFace = 'analog' | 'modular' | 'minimal';

type Props = {
  /** Rendered pixel width; height follows the 200x320 viewBox ratio (x1.6). */
  width: number;
  caseColor: string;
  /** A lighter sheen tone for the metal edge highlight. */
  caseSheen: string;
  bandColor: string;
  bandStyle: BandStyle;
  face: WatchFace;
  /** Apply the single system product-shadow (product resting on a surface). */
  onSurface?: boolean;
};

const VB_W = 200;
const VB_H = 320;

// Screen geometry (the OLED rests inside the case).
const CX = 100;
const CY = 160;
const FACE_R = 41;

function polar(angleDeg: number, len: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + len * Math.sin(rad), y: CY - len * Math.cos(rad) };
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * A live, fully vector watch render — the "product photograph" of the system.
 * The hands track the real clock; case, band and face react to configurator state.
 * Subtle gradients live ON the product (the artifact), never on UI surfaces.
 */
export function WatchRender({
  width,
  caseColor,
  caseSheen,
  bandColor,
  bandStyle,
  face,
  onSurface = true,
}: Props) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const height = (width * VB_H) / VB_W;

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = seconds * 6;

  const h = polar(hourAngle, 22);
  const m = polar(minuteAngle, 33);
  const s = polar(secondAngle, 36);

  // Single-accent progress ring: fraction of the day elapsed.
  const dayFrac = (hours * 3600 + minutes * 60 + seconds) / 86400;
  const ringR = 33;
  const ringCirc = 2 * Math.PI * ringR;

  return (
    <View
      style={
        onSurface
          ? {
              ...productShadow,
              width,
              height,
              alignSelf: 'center',
            }
          : { width, height, alignSelf: 'center' }
      }
    >
      <Svg width={width} height={height} viewBox={`0 0 ${VB_W} ${VB_H}`}>
        <Defs>
          <LinearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={caseSheen} />
            <Stop offset="0.5" stopColor={caseColor} />
            <Stop offset="1" stopColor={caseColor} />
          </LinearGradient>
          <LinearGradient id="band" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={bandColor} stopOpacity={0.82} />
            <Stop offset="0.5" stopColor={bandColor} />
            <Stop offset="1" stopColor={bandColor} stopOpacity={0.82} />
          </LinearGradient>
          <LinearGradient id="glass" x1="0" y1="0" x2="0.6" y2="1">
            <Stop offset="0" stopColor="#000000" />
            <Stop offset="1" stopColor="#0b0b0d" />
          </LinearGradient>
        </Defs>

        {/* ---- Bands (drawn first; the case overlaps their lugs) ---- */}
        <Band y={4} h={112} color={bandColor} style={bandStyle} top />
        <Band y={204} h={112} color={bandColor} style={bandStyle} top={false} />

        {/* ---- Case (cushion) ---- */}
        <Rect
          x={42}
          y={90}
          width={116}
          height={140}
          rx={36}
          ry={36}
          fill="url(#metal)"
        />
        {/* rim highlight */}
        <Rect
          x={43.2}
          y={91.2}
          width={113.6}
          height={137.6}
          rx={35}
          ry={35}
          fill="none"
          stroke={caseSheen}
          strokeOpacity={0.5}
          strokeWidth={1.2}
        />

        {/* Digital crown + side button */}
        <Rect x={156} y={142} width={9} height={24} rx={4.5} fill="url(#metal)" />
        <Rect x={157.5} y={147} width={6} height={14} rx={3} fill={caseSheen} fillOpacity={0.55} />
        <Rect x={157} y={176} width={6} height={30} rx={3} fill="url(#metal)" />

        {/* ---- Screen (OLED) ---- */}
        <Rect x={52} y={100} width={96} height={120} rx={28} ry={28} fill="url(#glass)" />

        {/* ---- Face ---- */}
        {face === 'analog' && (
          <AnalogFace
            h={h}
            m={m}
            s={s}
            date={now.getDate()}
            weekday={WEEKDAYS[now.getDay()]}
          />
        )}
        {face === 'modular' && (
          <ModularFace
            hh={pad(hours)}
            mm={pad(minutes)}
            ss={pad(seconds)}
            weekday={WEEKDAYS[now.getDay()]}
            date={now.getDate()}
            ringR={ringR}
            ringCirc={ringCirc}
            dayFrac={dayFrac}
          />
        )}
        {face === 'minimal' && <MinimalFace h={h} m={m} s={s} />}
      </Svg>
    </View>
  );
}

/* ----------------------------------------------------------------------- */
/* Bands                                                                   */
/* ----------------------------------------------------------------------- */

function Band({
  y,
  h,
  color,
  style,
  top,
}: {
  y: number;
  h: number;
  color: string;
  style: BandStyle;
  top: boolean;
}) {
  const bw = 72;
  const x = CX - bw / 2;

  const rounded = top
    ? { rx: 20, ry: 20 }
    : { rx: 20, ry: 20 };

  return (
    <G>
      <Rect x={x} y={y} width={bw} height={h} fill="url(#band)" {...rounded} />

      {style === 'sport' &&
        // perforation column near the free end of the band
        [0, 1, 2, 3].map((i) => (
          <Circle
            key={i}
            cx={CX}
            cy={top ? y + 18 + i * 16 : y + h - 18 - i * 16}
            r={3}
            fill="#000000"
            fillOpacity={0.22}
          />
        ))}

      {style === 'woven' &&
        // fine horizontal weave lines
        Array.from({ length: 9 }).map((_, i) => (
          <Line
            key={i}
            x1={x + 6}
            x2={x + bw - 6}
            y1={y + 10 + i * (h - 20) / 8}
            y2={y + 10 + i * (h - 20) / 8}
            stroke="#000000"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        ))}

      {style === 'link' &&
        // stacked metal links with thin gaps + a center seam
        Array.from({ length: 5 }).map((_, i) => (
          <G key={i}>
            <Rect
              x={x + 3}
              y={y + 6 + i * (h - 12) / 5}
              width={bw - 6}
              height={(h - 12) / 5 - 3}
              rx={4}
              fill="#ffffff"
              fillOpacity={0.05}
            />
            <Line
              x1={CX}
              x2={CX}
              y1={y + 6 + i * (h - 12) / 5}
              y2={y + 6 + i * (h - 12) / 5 + ((h - 12) / 5 - 3)}
              stroke="#000000"
              strokeOpacity={0.18}
              strokeWidth={1}
            />
          </G>
        ))}
    </G>
  );
}

/* ----------------------------------------------------------------------- */
/* Faces                                                                   */
/* ----------------------------------------------------------------------- */

function AnalogFace({
  h,
  m,
  s,
  date,
  weekday,
}: {
  h: { x: number; y: number };
  m: { x: number; y: number };
  s: { x: number; y: number };
  date: number;
  weekday: string;
}) {
  return (
    <G>
      {/* hour ticks */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = i * 30;
        const outer = polar(a, FACE_R - 2);
        const inner = polar(a, FACE_R - (i % 3 === 0 ? 9 : 6));
        return (
          <Line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke="#ffffff"
            strokeOpacity={i % 3 === 0 ? 0.9 : 0.45}
            strokeWidth={i % 3 === 0 ? 2 : 1}
            strokeLinecap="round"
          />
        );
      })}

      {/* day / date complication */}
      <SvgText
        x={CX + 14}
        y={CY + 3}
        fill={colors.primaryOnDark}
        fontFamily={fontFamily.semibold}
        fontSize={8}
        textAnchor="middle"
      >
        {weekday}
      </SvgText>
      <SvgText
        x={CX + 14}
        y={CY + 13}
        fill="#ffffff"
        fontFamily={fontFamily.semibold}
        fontSize={9}
        textAnchor="middle"
      >
        {date}
      </SvgText>

      {/* hands */}
      <Line x1={CX} y1={CY} x2={h.x} y2={h.y} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" />
      <Line x1={CX} y1={CY} x2={m.x} y2={m.y} stroke="#ffffff" strokeWidth={3} strokeLinecap="round" />
      <Line x1={CX} y1={CY} x2={s.x} y2={s.y} stroke={colors.primaryOnDark} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={CX} cy={CY} r={3.4} fill="#ffffff" />
      <Circle cx={CX} cy={CY} r={1.6} fill={colors.primaryOnDark} />
    </G>
  );
}

function ModularFace({
  hh,
  mm,
  ss,
  weekday,
  date,
  ringR,
  ringCirc,
  dayFrac,
}: {
  hh: string;
  mm: string;
  ss: string;
  weekday: string;
  date: number;
  ringR: number;
  ringCirc: number;
  dayFrac: number;
}) {
  return (
    <G>
      {/* single-accent day-progress ring */}
      <Circle cx={CX} cy={CY} r={ringR} stroke="#ffffff" strokeOpacity={0.12} strokeWidth={4} fill="none" />
      <Circle
        cx={CX}
        cy={CY}
        r={ringR}
        stroke={colors.primaryOnDark}
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${ringCirc * dayFrac} ${ringCirc}`}
        transform={`rotate(-90 ${CX} ${CY})`}
      />

      <SvgText
        x={CX}
        y={CY - 18}
        fill={colors.primaryOnDark}
        fontFamily={fontFamily.semibold}
        fontSize={8}
        textAnchor="middle"
      >
        {`${weekday} ${date}`}
      </SvgText>

      <SvgText
        x={CX}
        y={CY + 7}
        fill="#ffffff"
        fontFamily={fontFamily.light}
        fontSize={26}
        textAnchor="middle"
      >
        {`${hh}:${mm}`}
      </SvgText>

      <SvgText
        x={CX}
        y={CY + 24}
        fill="#ffffff"
        fillOpacity={0.6}
        fontFamily={fontFamily.regular}
        fontSize={9}
        textAnchor="middle"
      >
        {ss}
      </SvgText>
    </G>
  );
}

function MinimalFace({
  h,
  m,
  s,
}: {
  h: { x: number; y: number };
  m: { x: number; y: number };
  s: { x: number; y: number };
}) {
  const twelve = polar(0, FACE_R - 4);
  return (
    <G>
      <Circle cx={twelve.x} cy={twelve.y} r={2} fill={colors.primaryOnDark} />
      <Line x1={CX} y1={CY} x2={h.x} y2={h.y} stroke="#ffffff" strokeWidth={3.2} strokeLinecap="round" />
      <Line x1={CX} y1={CY} x2={m.x} y2={m.y} stroke="#ffffff" strokeWidth={2.2} strokeLinecap="round" />
      <Line x1={CX} y1={CY} x2={s.x} y2={s.y} stroke={colors.primaryOnDark} strokeWidth={1.2} strokeLinecap="round" />
      <Circle cx={CX} cy={CY} r={2.6} fill="#ffffff" />
    </G>
  );
}
