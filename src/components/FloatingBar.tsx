import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, spacing } from '../theme/tokens';
import { Txt } from './Txt';
import { PrimaryButton } from './Buttons';

type Props = {
  priceLabel: string;
  caption?: string;
  onAdd: () => void;
};

/**
 * floating-sticky-bar — pinned to the bottom on the buy surface during scroll.
 * Parchment @ 80% + backdrop blur. Left: running total. Right: Add to Bag pill.
 */
export function FloatingBar({ priceLabel, caption, onAdd }: Props) {
  const inner = (
    <View style={styles.row}>
      <View>
        {caption ? (
          <Txt token="finePrint" color={colors.inkMuted48}>
            {caption}
          </Txt>
        ) : null}
        <Txt token="bodyStrong" color={colors.ink}>
          {priceLabel}
        </Txt>
      </View>
      <PrimaryButton label="Add to Bag" onPress={onAdd} />
    </View>
  );

  if (Platform.OS === 'android') {
    return <View style={[styles.wrap, styles.androidTint]}>{inner}</View>;
  }
  return (
    <BlurView intensity={70} tint="light" style={styles.wrap}>
      <View style={styles.frostTint}>{inner}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 64,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.hairlineSoft,
    overflow: 'hidden',
    zIndex: 25,
  },
  frostTint: {
    flex: 1,
    backgroundColor: colors.frostedParchment,
  },
  androidTint: {
    backgroundColor: colors.canvasParchment,
  },
  row: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
