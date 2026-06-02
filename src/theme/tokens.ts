/**
 * Design tokens — Apple "reverent product photography, near-invisible UI" system.
 *
 * Every value here is a faithful transcription of the supplied design language.
 * Components must reference these tokens; raw hex is never inlined elsewhere.
 */

export const colors = {
  // Brand & accent — the single interactive color of the whole system.
  primary: '#0066cc', // Action Blue — every link & pill CTA
  primaryFocus: '#0071e3', // Focus Blue — keyboard focus ring
  primaryOnDark: '#2997ff', // Sky Link Blue — inline links on dark tiles

  // Surfaces
  canvas: '#ffffff', // Pure White — dominant canvas
  canvasParchment: '#f5f5f7', // Parchment — signature off-white, alternating tiles & footer
  surfacePearl: '#fafafc', // Pearl Button — ghost button fill
  surfaceTile1: '#272729', // Near-Black Tile 1 — primary dark tile
  surfaceTile2: '#2a2a2c', // Near-Black Tile 2 — micro-step lighter
  surfaceTile3: '#252527', // Near-Black Tile 3 — micro-step darker / player frames
  surfaceBlack: '#000000', // Pure Black — global nav, true void
  surfaceChipTranslucent: 'rgba(210, 210, 215, 0.64)', // translucent control chip over photography

  // Text
  ink: '#1d1d1f', // Near-Black Ink — every headline & body on light
  body: '#1d1d1f', // same near-black tone
  bodyOnDark: '#ffffff', // text on dark tiles & nav
  bodyMuted: '#cccccc', // secondary copy on dark tiles
  inkMuted80: '#333333', // body on Pearl Button surface
  inkMuted48: '#7a7a7a', // disabled text & legal fine-print

  // Hairlines & borders
  dividerSoft: 'rgba(0, 0, 0, 0.04)', // soft ring on secondary buttons
  hairline: '#e0e0e0', // 1px hairline on utility cards & chips
  hairlineSoft: 'rgba(0, 0, 0, 0.08)', // search input / sub-nav separator

  // Frosted overlay base (parchment @ 80%) — paired with blur where supported
  frostedParchment: 'rgba(245, 245, 247, 0.8)',
} as const;

/** The single drop-shadow in the entire system — reserved for product renders only. */
export const productShadow = {
  shadowColor: '#000000',
  shadowOffset: { width: 3, height: 5 },
  shadowOpacity: 0.22,
  shadowRadius: 30,
  elevation: 16, // Android approximation of the same soft drop
} as const;

/** 8px base spacing system; sub-base values for tight typographic adjustments. */
export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 17,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 80,
} as const;

/** Border radius scale — grammars never mixed (sm utility / lg cards / pill actions). */
export const radius = {
  none: 0,
  xs: 5,
  sm: 8,
  md: 11,
  lg: 18,
  pill: 9999,
  full: 9999,
} as const;

/** Inter weight ladder — mirrors the system's deliberate 300 / 400 / 600 / 700 (no 500). */
export const fontFamily = {
  light: 'Inter_300Light', // weight 300 — rare, airy reads
  regular: 'Inter_400Regular', // weight 400 — body default
  semibold: 'Inter_600SemiBold', // weight 600 — every headline
  bold: 'Inter_700Bold', // weight 700 — taglines that need assertion
} as const;

export type Colors = typeof colors;
