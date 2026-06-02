import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Accessory } from '../data/catalog';
import { AccessoryArt } from './AccessoryArt';
import { Txt } from './Txt';
import { TextLink } from './Buttons';

type Props = {
  accessory: Accessory;
  /** Card width, supplied by the responsive grid. */
  width: number;
  onBuy: () => void;
};

/**
 * store-utility-card — white fill, 1px hairline, 18px (lg) radius, 24px padding.
 * Image crop (1:1) at inner 8px (sm) radius. No card shadow by design.
 */
export function StoreCard({ accessory, width, onBuy }: Props) {
  const artSize = Math.min(width - spacing.lg * 2, 200);

  return (
    <View style={[styles.card, { width }]}>
      <View style={[styles.imageCrop, { height: artSize }]}>
        <AccessoryArt accessory={accessory} size={artSize * 0.8} />
      </View>

      <Txt token="captionStrong" color={colors.inkMuted48} style={styles.cat}>
        {accessory.category}
      </Txt>
      <Txt token="bodyStrong" color={colors.ink} numberOfLines={2}>
        {accessory.name}
      </Txt>
      <Txt token="body" color={colors.ink} style={styles.price}>
        {`$${accessory.price}`}
      </Txt>
      <View style={styles.link}>
        <TextLink label="Buy" onPress={onBuy} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  imageCrop: {
    width: '100%',
    borderRadius: radius.sm,
    backgroundColor: colors.canvasParchment,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  cat: {
    marginBottom: spacing.xxs,
  },
  price: {
    marginTop: spacing.xxs,
  },
  link: {
    marginTop: spacing.sm,
  },
});
