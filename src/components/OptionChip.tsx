import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Txt } from './Txt';

type Props = {
  label: string;
  /** Price delta line, e.g. "+$200" or "Included". */
  meta?: string;
  /** Optional color swatch (for case / band color chips). */
  swatch?: string;
  selected: boolean;
  onPress: () => void;
};

/**
 * configurator-option-chip — pill-shaped tappable cell.
 * Default: white fill, hairline border. Selected: 2px Focus-Blue border.
 */
export function OptionChip({ label, meta, swatch, selected, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected ? styles.selected : styles.unselected]}
    >
      {swatch ? (
        <View style={[styles.swatch, { backgroundColor: swatch }]} />
      ) : null}
      <View style={styles.text}>
        <Txt token="caption" color={colors.ink}>
          {label}
        </Txt>
        {meta ? (
          <Txt token="microLegal" color={colors.inkMuted48} style={styles.meta}>
            {meta}
          </Txt>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.canvas,
    borderRadius: radius.pill,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    gap: spacing.xs,
  },
  unselected: {
    borderWidth: 1,
    borderColor: colors.hairline,
  },
  selected: {
    borderWidth: 2,
    borderColor: colors.primaryFocus,
    // compensate the extra border px so the chip doesn't jump on selection
    paddingVertical: 11,
    paddingHorizontal: 15,
  },
  swatch: {
    width: 18,
    height: 18,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairlineSoft,
  },
  text: {
    alignItems: 'flex-start',
  },
  meta: {
    marginTop: 1,
  },
});
