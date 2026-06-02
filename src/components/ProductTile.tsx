import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { CONTENT_MAX } from '../theme/responsive';
import { Txt } from './Txt';
import { CtaPair } from './Buttons';

export type TileVariant = 'light' | 'parchment' | 'dark' | 'dark2' | 'dark3';

const VARIANT_BG: Record<TileVariant, string> = {
  light: colors.canvas,
  parchment: colors.canvasParchment,
  dark: colors.surfaceTile1,
  dark2: colors.surfaceTile2,
  dark3: colors.surfaceTile3,
};

function isDark(v: TileVariant) {
  return v === 'dark' || v === 'dark2' || v === 'dark3';
}

type Props = {
  variant: TileVariant;
  eyebrow?: string;
  title: string;
  tagline?: string;
  /** Render the two pill CTAs ("Learn more" / "Buy"). */
  showCtas?: boolean;
  onLearn?: () => void;
  onBuy?: () => void;
  sectionPadV: number;
  headingSize: number;
  /** The product render (or any visual) shown below the copy stack. */
  children?: React.ReactNode;
  /** Place the visual above the copy instead of below. */
  visualFirst?: boolean;
};

/**
 * product-tile — full-bleed, edge-to-edge, no rounding, no border, no shadow.
 * The surface-color change between consecutive tiles IS the section divider.
 * Centered stack: headline -> one-line tagline -> two pill CTAs -> product render.
 */
export function ProductTile({
  variant,
  eyebrow,
  title,
  tagline,
  showCtas = true,
  onLearn,
  onBuy,
  sectionPadV,
  headingSize,
  children,
  visualFirst = false,
}: Props) {
  const dark = isDark(variant);
  const ink = dark ? colors.bodyOnDark : colors.ink;
  const sub = dark ? colors.bodyMuted : colors.ink;
  const accent = dark ? colors.primaryOnDark : colors.primary;

  const copy = (
    <View style={styles.copy}>
      {eyebrow ? (
        <Txt token="bodyStrong" color={accent} align="center" style={styles.eyebrow}>
          {eyebrow}
        </Txt>
      ) : null}
      <Txt token="displayLg" color={ink} size={headingSize} align="center">
        {title}
      </Txt>
      {tagline ? (
        <Txt token="lead" color={sub} align="center" style={styles.tagline}>
          {tagline}
        </Txt>
      ) : null}
      {showCtas && (
        <View style={styles.ctas}>
          <CtaPair onLearn={onLearn} onBuy={onBuy} onDark={dark} />
        </View>
      )}
    </View>
  );

  return (
    <View
      style={[
        styles.tile,
        { backgroundColor: VARIANT_BG[variant], paddingVertical: sectionPadV },
      ]}
    >
      <View style={styles.inner}>
        {visualFirst ? (
          <>
            {children ? <View style={styles.visual}>{children}</View> : null}
            {copy}
          </>
        ) : (
          <>
            {copy}
            {children ? <View style={styles.visual}>{children}</View> : null}
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '100%',
    paddingHorizontal: spacing.lg,
  },
  inner: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    alignItems: 'center',
  },
  copy: {
    alignItems: 'center',
    maxWidth: 720,
  },
  eyebrow: {
    marginBottom: spacing.sm,
  },
  tagline: {
    marginTop: spacing.md,
  },
  ctas: {
    marginTop: spacing.lg,
  },
  visual: {
    marginTop: spacing.xxl,
    alignItems: 'center',
  },
});
