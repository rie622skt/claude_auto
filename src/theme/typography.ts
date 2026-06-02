import { TextStyle } from 'react-native';
import { fontFamily } from './tokens';

/**
 * Typography ladder transcribed from the design language.
 *
 * React Native takes absolute lineHeight (px), so the documented multipliers are
 * pre-computed here. Two Inter-substitution rules from the guide are applied:
 *   1. Display sizes get an extra -0.01em tracking nudge (Inter runs wider than SF Pro).
 *   2. Body leading is tightened by 0.03 (1.47 -> 1.44) for Inter's taller x-height.
 *
 * Weight is expressed through fontFamily (the loaded Inter variant) rather than
 * fontWeight, because RN does not synthesize weights reliably from one family.
 */
export const type = {
  // Hero headline — the signature "Apple tight" tracking.
  heroDisplay: {
    fontFamily: fontFamily.semibold,
    fontSize: 56,
    lineHeight: 60,
    letterSpacing: -0.84, // -0.28 documented + (-0.01em Inter nudge)
  },
  // Tile headlines atop every product tile.
  displayLg: {
    fontFamily: fontFamily.semibold,
    fontSize: 40,
    lineHeight: 44,
    letterSpacing: -0.4,
  },
  // Section heads.
  displayMd: {
    fontFamily: fontFamily.semibold,
    fontSize: 34,
    lineHeight: 50,
    letterSpacing: -0.71,
  },
  // Product tile subcopy.
  lead: {
    fontFamily: fontFamily.regular,
    fontSize: 28,
    lineHeight: 32,
    letterSpacing: 0.196,
  },
  // Environment-page lead paragraphs — the rare weight 300.
  leadAiry: {
    fontFamily: fontFamily.light,
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
  },
  // Sub-tile tagline; sub-nav category name.
  tagline: {
    fontFamily: fontFamily.semibold,
    fontSize: 21,
    lineHeight: 25,
    letterSpacing: 0.231,
  },
  // The assertive 700 variant of the tagline.
  taglineBold: {
    fontFamily: fontFamily.bold,
    fontSize: 21,
    lineHeight: 25,
    letterSpacing: 0.231,
  },
  // Inline strong emphasis.
  bodyStrong: {
    fontFamily: fontFamily.semibold,
    fontSize: 17,
    lineHeight: 21,
    letterSpacing: -0.374,
  },
  // Default paragraph — 17px, not 16px.
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 24, // 17 * 1.44 (Inter-tightened from 1.47)
    letterSpacing: -0.374,
  },
  // Footer / store utility link lists — deliberately relaxed leading.
  denseLink: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 41, // 17 * 2.41 — this is how the dense columns breathe
    letterSpacing: 0,
  },
  // Secondary captions, button text.
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.224,
  },
  // Emphasized captions / column headings.
  captionStrong: {
    fontFamily: fontFamily.semibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.224,
  },
  // Store hero CTAs — the rare weight 300.
  buttonLarge: {
    fontFamily: fontFamily.light,
    fontSize: 18,
    lineHeight: 20,
    letterSpacing: 0,
  },
  // Utility / nav button labels.
  buttonUtility: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.224,
  },
  // Fine-print, footer body.
  finePrint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: -0.12,
  },
  // Micro legal disclaimers.
  microLegal: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: -0.08,
  },
  // Global nav menu items.
  navLink: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 14,
    letterSpacing: -0.12,
  },
} satisfies Record<string, TextStyle>;

export type TypeToken = keyof typeof type;
