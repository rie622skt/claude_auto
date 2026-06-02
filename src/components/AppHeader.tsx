import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { Txt } from './Txt';
import { Icon } from './Icon';

type Props =
  | { mode: 'home'; onInsights: () => void; onSettings: () => void }
  | { mode: 'sub'; title: string; onBack: () => void };

/** global-nav — ultra-thin true-black bar (the only pure black on the page). */
export function AppHeader(props: Props) {
  return (
    <View style={styles.bar}>
      {props.mode === 'home' ? (
        <>
          <Txt token="tagline" color={colors.bodyOnDark} style={styles.brand}>
            Cadence
          </Txt>
          <View style={styles.right}>
            <Pressable onPress={props.onInsights} hitSlop={10} style={styles.iconBtn} accessibilityLabel="Insights">
              <Icon name="chart" size={20} color={colors.bodyOnDark} />
            </Pressable>
            <Pressable onPress={props.onSettings} hitSlop={10} style={styles.iconBtn} accessibilityLabel="Settings">
              <Icon name="gear" size={20} color={colors.bodyOnDark} />
            </Pressable>
          </View>
        </>
      ) : (
        <Pressable onPress={props.onBack} hitSlop={10} style={styles.backRow} accessibilityLabel="Back">
          <Icon name="chevronLeft" size={22} color={colors.bodyOnDark} />
          <Txt token="tagline" color={colors.bodyOnDark}>
            {props.title}
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    height: 44,
    backgroundColor: colors.surfaceBlack,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    letterSpacing: 0.5,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  iconBtn: {
    padding: 2,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
});
