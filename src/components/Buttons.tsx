import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Txt } from './Txt';

/**
 * The system-wide press micro-interaction: transform scale(0.95).
 * Every button shares this gesture — it is the only "animation" in the system.
 */
function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, {
      toValue: v,
      useNativeDriver: true,
      speed: 40,
      bounciness: 0,
    }).start();
  return {
    scale,
    onPressIn: () => to(0.95),
    onPressOut: () => to(1),
  };
}

type BtnProps = Omit<PressableProps, 'style'> & {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
};

/** button-primary — the signature Apple action: Action Blue, full pill. */
export function PrimaryButton({ label, onPress, style, ...rest }: BtnProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.primary, style]}
        {...rest}
      >
        <Txt token="body" color={colors.canvas}>
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/** button-secondary-pill — the "ghost pill" second CTA. */
export function SecondaryPill({ label, onPress, style, onDark, ...rest }: BtnProps & { onDark?: boolean }) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  const tint = onDark ? colors.primaryOnDark : colors.primary;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.ghost, { borderColor: tint }, style]}
        {...rest}
      >
        <Txt token="body" color={tint}>
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/** button-store-hero — larger primary CTA, the rare weight-300 label. */
export function StoreHeroButton({ label, onPress, style, ...rest }: BtnProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.storeHero, style]}
        {...rest}
      >
        <Txt token="buttonLarge" color={colors.canvas}>
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/** button-dark-utility — global-nav actions (Sign In, Bag). */
export function DarkUtilityButton({ label, onPress, style, ...rest }: BtnProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.darkUtility, style]}
        {...rest}
      >
        <Txt token="buttonUtility" color={colors.bodyOnDark}>
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/** text-link / text-link-on-dark — inline action in Action Blue (or Sky Link Blue on dark). */
export function TextLink({
  label,
  onPress,
  onDark,
  strong,
}: {
  label: string;
  onPress?: () => void;
  onDark?: boolean;
  strong?: boolean;
}) {
  const tint = onDark ? colors.primaryOnDark : colors.primary;
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8}>
      <Txt token={strong ? 'bodyStrong' : 'body'} color={tint}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** A pair of CTAs as they appear atop a product tile ("Learn more" / "Buy"). */
export function CtaPair({
  onLearn,
  onBuy,
  onDark,
}: {
  onLearn?: () => void;
  onBuy?: () => void;
  onDark?: boolean;
}) {
  return (
    <View style={styles.ctaRow}>
      <SecondaryPill label="Learn more" onPress={onLearn} onDark={onDark} />
      <PrimaryButton label="Buy" onPress={onBuy} />
    </View>
  );
}

const styles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 11,
    paddingHorizontal: 22,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    backgroundColor: 'transparent',
    borderRadius: radius.pill,
    borderWidth: 1,
    paddingVertical: 11,
    paddingHorizontal: 22,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeHero: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    paddingHorizontal: 28,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkUtility: {
    backgroundColor: colors.ink,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
});
