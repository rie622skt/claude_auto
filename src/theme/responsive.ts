import { useWindowDimensions } from 'react-native';

/**
 * Breakpoints that matter for layout, per the design language:
 * 1440 (content lock), 1068 (small-desktop), 833 (tablet landscape switch),
 * 734 (tablet portrait), 640 (phone), 480 (small phone).
 */
export const breakpoints = {
  smallPhone: 480,
  phone: 640,
  largePhone: 734,
  tabletPortrait: 833,
  tabletLandscape: 1068,
  desktop: 1440,
} as const;

export const CONTENT_MAX = 1440; // content locks here; margins absorb extra width
export const TEXT_MAX = 980; // text-heavy sections cap narrower

export type Layout = {
  width: number;
  /** Collapse the global nav to a hamburger at/below tablet portrait. */
  navCollapsed: boolean;
  /** Single-column tile stacks below tablet portrait. */
  isCompact: boolean;
  /** Utility-grid column count: 5 -> 4 -> 3 -> 2 -> 1. */
  gridColumns: number;
  /** Section vertical padding tightens on small screens (80 -> 48). */
  sectionPadV: number;
  /** Hero headline size steps down across breakpoints (56 -> 40 -> 34 -> 28). */
  heroSize: number;
  /** Tile headline size steps down on phones (40 -> 34 -> 28). */
  tileHeadingSize: number;
};

export function useLayout(): Layout {
  const { width } = useWindowDimensions();

  const navCollapsed = width <= breakpoints.tabletPortrait;
  const isCompact = width <= breakpoints.tabletPortrait;

  let gridColumns = 5;
  if (width <= breakpoints.phone) gridColumns = 1;
  else if (width <= breakpoints.tabletPortrait) gridColumns = 2;
  else if (width <= breakpoints.tabletLandscape) gridColumns = 3;
  else if (width <= breakpoints.desktop) gridColumns = 4;

  const sectionPadV = width <= breakpoints.smallPhone ? 48 : 80;

  let heroSize = 56;
  if (width <= breakpoints.smallPhone) heroSize = 28;
  else if (width <= breakpoints.phone) heroSize = 34;
  else if (width <= breakpoints.tabletLandscape) heroSize = 40;

  let tileHeadingSize = 40;
  if (width <= breakpoints.smallPhone) tileHeadingSize = 28;
  else if (width <= breakpoints.phone) tileHeadingSize = 34;

  return {
    width,
    navCollapsed,
    isCompact,
    gridColumns,
    sectionPadV,
    heroSize,
    tileHeadingSize,
  };
}
