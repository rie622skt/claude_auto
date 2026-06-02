import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors, radius } from '../theme/tokens';
import { Txt } from './Txt';
import { Icon, IconName } from './Icon';

/**
 * The system-wide press micro-interaction: transform scale(0.95).
 * Every button shares this gesture — the only "animation" the design system uses on controls.
 */
function usePressScale() {
  const scale = useRef(new Animated.Value(1)).current;
  const to = (v: number) =>
    Animated.spring(scale, { toValue: v, useNativeDriver: true, speed: 40, bounciness: 0 }).start();
  return { scale, onPressIn: () => to(0.95), onPressOut: () => to(1) };
}

type BtnProps = Omit<PressableProps, 'style'> & {
  label: string;
  onPress?: () => void;
  style?: ViewStyle;
  /** Larger hero sizing (the rare weight-300 label at 18px). */
  large?: boolean;
  disabled?: boolean;
};

/** button-primary — the signature action: Action Blue, full pill. */
export function PrimaryButton({ label, onPress, style, large, disabled, ...rest }: BtnProps) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }], opacity: disabled ? 0.4 : 1 }}>
      <Pressable
        accessibilityRole="button"
        disabled={disabled}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.primary, large && styles.primaryLarge, style]}
        {...rest}
      >
        <Txt token={large ? 'buttonLarge' : 'body'} color={colors.canvas}>
          {label}
        </Txt>
      </Pressable>
    </Animated.View>
  );
}

/** button-secondary-pill — the "ghost pill" (blue on light, sky-blue on dark). */
export function GhostPill({
  label,
  onPress,
  style,
  onDark,
  ...rest
}: BtnProps & { onDark?: boolean }) {
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

/** text-link / text-link-on-dark — inline action in Action Blue (Sky Link Blue on dark). */
export function TextLink({
  label,
  onPress,
  onDark,
  muted,
}: {
  label: string;
  onPress?: () => void;
  onDark?: boolean;
  muted?: boolean;
}) {
  const tint = muted
    ? onDark
      ? colors.bodyMuted
      : colors.inkMuted48
    : onDark
      ? colors.primaryOnDark
      : colors.primary;
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={10}>
      <Txt token="body" color={tint}>
        {label}
      </Txt>
    </Pressable>
  );
}

/** button-icon-circular — a quiet 56px control chip, used for session play/pause/end. */
export function IconButton({
  name,
  onPress,
  color = colors.bodyOnDark,
  bg = 'rgba(255,255,255,0.10)',
  size = 56,
  label,
}: {
  name: IconName;
  onPress?: () => void;
  color?: string;
  bg?: string;
  size?: number;
  label?: string;
}) {
  const { scale, onPressIn, onPressOut } = usePressScale();
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[styles.iconBtn, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}
      >
        <Icon name={name} size={Math.round(size * 0.4)} color={color} strokeWidth={2} />
      </Pressable>
    </Animated.View>
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
  primaryLarge: {
    paddingVertical: 15,
    paddingHorizontal: 36,
    minHeight: 52,
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
  iconBtn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
