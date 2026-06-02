import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { colors, radius, spacing } from '../theme/tokens';
import { Section, SECTIONS } from '../navigation';
import { Txt } from './Txt';

type Props = {
  active: Section;
  onNavigate: (s: Section) => void;
  navCollapsed: boolean;
  onBuy: () => void;
};

const CATEGORY_LABEL: Record<Section, string> = {
  overview: 'NOVA Watch',
  configure: 'NOVA Watch',
  accessories: 'Accessories',
};

/**
 * sub-nav-frosted — sticks below the global nav: parchment @ 80% + backdrop blur.
 * Left: category name (tagline). Right: inline section links + a persistent Buy pill.
 * On compact widths the inline links drop away, leaving category + Buy only.
 */
export function SubNav({ active, onNavigate, navCollapsed, onBuy }: Props) {
  const inner = (
    <View style={styles.row}>
      <Txt token="tagline" color={colors.ink}>
        {CATEGORY_LABEL[active]}
      </Txt>

      <View style={styles.right}>
        {!navCollapsed &&
          SECTIONS.map((s) => (
            <Pressable key={s.id} onPress={() => onNavigate(s.id)} hitSlop={6}>
              <Txt
                token="buttonUtility"
                color={active === s.id ? colors.ink : colors.inkMuted48}
              >
                {s.label}
              </Txt>
            </Pressable>
          ))}

        <Pressable onPress={onBuy} style={styles.buy}>
          <Txt token="buttonUtility" color={colors.canvas}>
            Buy
          </Txt>
        </Pressable>
      </View>
    </View>
  );

  // BlurView gives the true frosted look on iOS/web; Android falls back to the
  // parchment-at-80% tint, which the design names as the base color anyway.
  if (Platform.OS === 'android') {
    return <View style={[styles.wrap, styles.androidTint]}>{inner}</View>;
  }
  return (
    <BlurView intensity={60} tint="light" style={styles.wrap}>
      <View style={styles.frostTint}>{inner}</View>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 52,
    zIndex: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.hairlineSoft,
    overflow: 'hidden',
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
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  buy: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 7,
    paddingHorizontal: 16,
    minHeight: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
