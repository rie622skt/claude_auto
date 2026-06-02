import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Txt } from './Txt';
import { colors } from '../theme/tokens';

type Phase = 'in' | 'out';

type Props = {
  size: number;
  accent: string;
  /** Number of inhale/exhale pairs before completing. */
  cycles?: number;
  /** Fires a subtle haptic at each phase change (parent decides what it does). */
  onPhase?: (phase: Phase) => void;
  onComplete: () => void;
};

const PHASE_MS = 3900;

/**
 * A calm settle-in pacer shown before the timer starts. One JS timer drives both
 * the label and the scale animation so they never drift apart.
 */
export function BreathingOrb({ size, accent, cycles = 3, onPhase, onComplete }: Props) {
  const scale = useRef(new Animated.Value(0.72)).current;
  const [phase, setPhase] = useState<Phase>('in');
  const phasesDone = useRef(0);
  const totalPhases = cycles * 2;

  useEffect(() => {
    let inhale = true;
    const step = () => {
      setPhase(inhale ? 'in' : 'out');
      onPhase?.(inhale ? 'in' : 'out');
      Animated.timing(scale, {
        toValue: inhale ? 1 : 0.72,
        duration: PHASE_MS,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start();
      inhale = !inhale;
      phasesDone.current += 1;
      if (phasesDone.current >= totalPhases) {
        clearInterval(id);
        setTimeout(onComplete, PHASE_MS);
      }
    };
    step();
    const id = setInterval(step, PHASE_MS + 100);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const orb = size * 0.62;

  return (
    <View style={[styles.wrap, { width: size, height: size }]}>
      <Animated.View
        style={[
          styles.orb,
          {
            width: orb,
            height: orb,
            borderRadius: orb / 2,
            backgroundColor: accent,
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.label}>
        <Txt token="lead" color={colors.bodyOnDark}>
          {phase === 'in' ? 'Breathe in' : 'Breathe out'}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  orb: {
    position: 'absolute',
    opacity: 0.22,
  },
  label: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
