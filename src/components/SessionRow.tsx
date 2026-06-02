import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Session } from '../state/store';
import { formatDuration } from '../state/insights';
import { Txt } from './Txt';

function whenLabel(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const startOf = (x: Date) => {
    const y = new Date(x);
    y.setHours(0, 0, 0, 0);
    return y.getTime();
  };
  const dayDiff = Math.round((startOf(now) - startOf(d)) / 86400000);
  const time = `${d.getHours()}:${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}`;
  let day: string;
  if (dayDiff === 0) day = 'Today';
  else if (dayDiff === 1) day = 'Yesterday';
  else if (dayDiff < 7) day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d.getDay()];
  else day = `${d.getMonth() + 1}/${d.getDate()}`;
  return `${day} · ${time}`;
}

/** Mood expressed only through the single accent: filled → ring → hairline. */
function MoodDot({ session }: { session: Session }) {
  if (session.kind === 'break') {
    return <View style={[styles.dot, { backgroundColor: colors.hairline }]} />;
  }
  if (session.mood === 'flow') {
    return <View style={[styles.dot, { backgroundColor: colors.primary }]} />;
  }
  if (session.mood === 'okay') {
    return <View style={[styles.dot, styles.ring, { borderColor: colors.primary }]} />;
  }
  return <View style={[styles.dot, styles.ring, { borderColor: colors.hairline }]} />;
}

export function SessionRow({ session }: { session: Session }) {
  const title =
    session.kind === 'break'
      ? 'Break'
      : session.intention.trim() || 'Focus';
  const meta = `${formatDuration(session.actualSec)}${session.completed ? '' : ' · ended early'} · ${whenLabel(session.startedAt)}`;

  return (
    <View style={styles.row}>
      <MoodDot session={session} />
      <View style={styles.body}>
        <Txt token="bodyStrong" color={colors.ink} numberOfLines={1}>
          {title}
        </Txt>
        <Txt token="caption" color={colors.inkMuted48}>
          {meta}
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  body: {
    flex: 1,
    gap: 2,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    marginTop: 2,
  },
  ring: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
});
