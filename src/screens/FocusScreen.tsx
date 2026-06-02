import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { colors, fontFamily, radius, spacing } from '../theme/tokens';
import { type as typeTokens } from '../theme/typography';
import { useLayout } from '../theme/responsive';
import { Mood, Session, useStore } from '../state/store';
import { todaySeconds, formatDuration, formatClock } from '../state/insights';
import { useCountdown } from '../state/useTimer';
import { haptic } from '../state/haptics';
import { Txt } from '../components/Txt';
import { PrimaryButton, TextLink, IconButton } from '../components/Buttons';
import { Chip } from '../components/Chip';
import { Ring } from '../components/Ring';
import { BreathingOrb } from '../components/BreathingOrb';

type Stage = 'setup' | 'breathing' | 'running' | 'reflect';

const DURATIONS = [15, 25, 45, 60];
const BREAK_MIN = 5;

const MOODS: { id: Mood; label: string }[] = [
  { id: 'scattered', label: 'Scattered' },
  { id: 'okay', label: 'Okay' },
  { id: 'flow', label: 'In flow' },
];

type Props = {
  onImmersive: (immersive: boolean) => void;
};

export function FocusScreen({ onImmersive }: Props) {
  const { settings, sessions, addSession } = useStore();
  const layout = useLayout();

  const [stage, setStage] = useState<Stage>('setup');
  const [intention, setIntention] = useState('');
  const [durationMin, setDurationMin] = useState(settings.defaultMin);
  const [mood, setMood] = useState<Mood | null>(null);

  const kindRef = useRef<'focus' | 'break'>('focus');
  const startedAtRef = useRef<string>('');
  const finishedRef = useRef<{
    intention: string;
    plannedMin: number;
    actualSec: number;
    completed: boolean;
  } | null>(null);

  const timer = useCountdown(() => handleComplete());

  useEffect(() => onImmersive(stage !== 'setup'), [stage, onImmersive]);

  // Keep the default-duration preference in sync if it changes in Settings.
  useEffect(() => {
    if (stage === 'setup') setDurationMin(settings.defaultMin);
  }, [settings.defaultMin, stage]);

  const focusedToday = todaySeconds(sessions);

  function persist(partial: Omit<Session, 'id' | 'startedAt' | 'endedAt'>) {
    addSession({
      ...partial,
      startedAt: startedAtRef.current || new Date().toISOString(),
      endedAt: new Date().toISOString(),
    });
  }

  function actuallyStart(min: number) {
    startedAtRef.current = new Date().toISOString();
    timer.start(min * 60 * 1000);
    setStage('running');
    haptic.medium();
  }

  function onBegin() {
    kindRef.current = 'focus';
    if (settings.breathing) {
      haptic.medium();
      setStage('breathing');
    } else {
      actuallyStart(durationMin);
    }
  }

  function startBreak() {
    kindRef.current = 'break';
    setMood(null);
    actuallyStart(BREAK_MIN);
  }

  function handleComplete() {
    haptic.success();
    const isBreak = kindRef.current === 'break';
    const plannedMin = isBreak ? BREAK_MIN : durationMin;
    const actualSec = plannedMin * 60;
    if (isBreak) {
      persist({ intention: '', plannedMin, actualSec, completed: true, mood: null, kind: 'break' });
      setStage('setup');
    } else {
      finishedRef.current = { intention, plannedMin, actualSec, completed: true };
      setMood(null);
      setStage('reflect');
    }
  }

  function endEarly() {
    haptic.light();
    const isBreak = kindRef.current === 'break';
    const plannedMin = isBreak ? BREAK_MIN : durationMin;
    const actualSec = Math.round(timer.elapsedMs / 1000);
    timer.stop();
    if (isBreak) {
      if (actualSec >= 20) {
        persist({ intention: '', plannedMin, actualSec, completed: false, mood: null, kind: 'break' });
      }
      setStage('setup');
    } else {
      finishedRef.current = { intention, plannedMin, actualSec, completed: false };
      setMood(null);
      setStage('reflect');
    }
  }

  function saveReflection(thenBreak: boolean) {
    const f = finishedRef.current;
    if (f) {
      persist({
        intention: f.intention,
        plannedMin: f.plannedMin,
        actualSec: f.actualSec,
        completed: f.completed,
        mood,
        kind: 'focus',
      });
    }
    haptic.selection();
    finishedRef.current = null;
    setIntention('');
    if (thenBreak) startBreak();
    else setStage('setup');
  }

  /* --------------------------------------------------------------------- */

  if (stage === 'setup') {
    return (
      <ScrollView
        style={styles.lightFill}
        contentContainerStyle={styles.setup}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.setupInner}>
          <Txt token="bodyStrong" color={colors.primary} style={styles.eyebrow}>
            {focusedToday > 0
              ? `${formatDuration(focusedToday)} focused today`
              : 'A calm space to do one thing well'}
          </Txt>
          <Txt token="displayMd" color={colors.ink} size={layout.tileHeadingSize - 4}>
            What will you focus on?
          </Txt>

          <TextInput
            value={intention}
            onChangeText={setIntention}
            placeholder="e.g. Draft the proposal"
            placeholderTextColor={colors.inkMuted48}
            style={styles.input}
            returnKeyType="done"
            maxLength={80}
          />

          <Txt token="bodyStrong" color={colors.ink} style={styles.fieldLabel}>
            For how long?
          </Txt>
          <View style={styles.chips}>
            {DURATIONS.map((d) => (
              <Chip
                key={d}
                label={`${d} min`}
                selected={durationMin === d}
                onPress={() => {
                  haptic.selection();
                  setDurationMin(d);
                }}
              />
            ))}
          </View>

          <View style={styles.beginRow}>
            <PrimaryButton label="Begin" large onPress={onBegin} />
          </View>
          {settings.breathing && (
            <Txt token="caption" color={colors.inkMuted48} style={styles.hint}>
              A short breathing pause will help you settle in first.
            </Txt>
          )}
        </View>
      </ScrollView>
    );
  }

  // Immersive (dark) stages share one calm near-black canvas.
  const ringSize = Math.min(layout.width * 0.74, 320);
  const timeSize = Math.min(layout.width * 0.18, 72);

  return (
    <View style={styles.darkFill}>
      <View style={styles.darkInner}>
        {stage === 'breathing' && (
          <>
            <Txt token="tagline" color={colors.bodyMuted} style={styles.darkTop}>
              Settle in
            </Txt>
            <BreathingOrb
              size={ringSize}
              accent={colors.primaryOnDark}
              cycles={3}
              onPhase={() => haptic.light()}
              onComplete={() => actuallyStart(durationMin)}
            />
            <View style={styles.darkControls}>
              <TextLink label="Skip" onDark muted onPress={() => actuallyStart(durationMin)} />
            </View>
          </>
        )}

        {(stage === 'running') && (
          <>
            <Txt token="tagline" color={colors.bodyMuted} numberOfLines={1} style={styles.darkTop}>
              {kindRef.current === 'break' ? 'Break' : intention.trim() || 'Focus'}
            </Txt>

            <Ring
              size={ringSize}
              progress={timer.remainingFraction}
              color={colors.primaryOnDark}
              trackColor="rgba(255,255,255,0.12)"
              strokeWidth={6}
            >
              <Txt
                token="heroDisplay"
                style={[
                  styles.time,
                  { fontSize: timeSize, lineHeight: Math.round(timeSize * 1.08) },
                ]}
              >
                {formatClock(timer.remainingMs)}
              </Txt>
              <Txt token="caption" color={colors.bodyMuted}>
                {timer.phase === 'paused' ? 'Paused' : 'remaining'}
              </Txt>
            </Ring>

            <View style={styles.darkControls}>
              <IconButton
                name={timer.phase === 'paused' ? 'play' : 'pause'}
                onPress={() => {
                  haptic.light();
                  timer.phase === 'paused' ? timer.resume() : timer.pause();
                }}
                label={timer.phase === 'paused' ? 'Resume' : 'Pause'}
              />
              <View style={styles.endRow}>
                <TextLink label="End session" onDark muted onPress={endEarly} />
              </View>
            </View>
          </>
        )}

        {stage === 'reflect' && (
          <View style={styles.reflect}>
            <Txt token="caption" color={colors.primaryOnDark}>
              {finishedRef.current?.completed ? 'Session complete' : 'Session ended'}
            </Txt>
            <Txt
              token="heroDisplay"
              color={colors.bodyOnDark}
              size={timeSize}
              style={[styles.reflectDur, { lineHeight: Math.round(timeSize * 1.08) }]}
            >
              {formatDuration(finishedRef.current?.actualSec ?? 0)}
            </Txt>
            {finishedRef.current?.intention.trim() ? (
              <Txt token="lead" color={colors.bodyMuted} align="center" style={styles.reflectIntent}>
                {finishedRef.current.intention.trim()}
              </Txt>
            ) : null}

            <Txt token="bodyStrong" color={colors.bodyOnDark} style={styles.reflectQ}>
              How did that go?
            </Txt>
            <View style={styles.chipsCenter}>
              {MOODS.map((m) => (
                <Chip
                  key={m.id}
                  label={m.label}
                  selected={mood === m.id}
                  onDark
                  onPress={() => {
                    haptic.selection();
                    setMood(m.id);
                  }}
                />
              ))}
            </View>

            <View style={styles.reflectActions}>
              <PrimaryButton label="Save" large onPress={() => saveReflection(false)} />
            </View>
            <TextLink label="Save & take a 5‑min break" onDark muted onPress={() => saveReflection(true)} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  lightFill: { flex: 1, backgroundColor: colors.canvasParchment },
  setup: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
  },
  setupInner: {
    width: '100%',
    maxWidth: 560,
  },
  eyebrow: { marginBottom: spacing.sm },
  input: {
    ...typeTokens.body,
    color: colors.ink,
    backgroundColor: colors.canvas,
    borderWidth: 1,
    borderColor: colors.hairline,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 52,
    marginTop: spacing.lg,
  },
  fieldLabel: { marginTop: spacing.xl, marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  beginRow: { marginTop: spacing.xl, alignItems: 'flex-start' },
  hint: { marginTop: spacing.sm },

  darkFill: { flex: 1, backgroundColor: colors.surfaceTile3 },
  darkInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.xxl,
  },
  darkTop: {
    position: 'absolute',
    top: spacing.xxl,
    left: spacing.lg,
    right: spacing.lg,
    textAlign: 'center',
  },
  time: {
    fontFamily: fontFamily.light,
    color: colors.bodyOnDark,
    letterSpacing: -1,
    fontVariant: ['tabular-nums'],
  },
  darkControls: { alignItems: 'center', gap: spacing.lg },
  endRow: { marginTop: spacing.xs },

  reflect: { alignItems: 'center', width: '100%', maxWidth: 480 },
  reflectDur: { fontFamily: fontFamily.light, marginTop: spacing.xs },
  reflectIntent: { marginTop: spacing.xs },
  reflectQ: { marginTop: spacing.xxl, marginBottom: spacing.md },
  chipsCenter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
  reflectActions: { marginTop: spacing.xxl, marginBottom: spacing.md },
});
