import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius } from '../theme/tokens';
import { Txt } from './Txt';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
  onDark?: boolean;
};

/**
 * Pill-shaped selectable cell (the configurator-option-chip grammar).
 * Default: hairline border. Selected: 2px Focus-Blue border.
 */
export function Chip({ label, selected, onPress, onDark }: Props) {
  const textColor = onDark ? colors.bodyOnDark : colors.ink;
  const focusBorder = onDark ? colors.primaryOnDark : colors.primaryFocus;
  const restBorder = onDark ? 'rgba(255,255,255,0.18)' : colors.hairline;
  const restBg = onDark ? 'rgba(255,255,255,0.06)' : colors.canvas;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: restBg },
        selected
          ? { borderWidth: 2, borderColor: focusBorder, paddingVertical: 9, paddingHorizontal: 17 }
          : { borderWidth: 1, borderColor: restBorder },
      ]}
    >
      <Txt token="caption" color={textColor}>
        {label}
      </Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: radius.pill,
    paddingVertical: 10,
    paddingHorizontal: 18,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
