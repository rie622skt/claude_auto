import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, fontFamily, spacing } from '../theme/tokens';
import { useLayout } from '../theme/responsive';
import { useStore } from '../state/store';
import {
  bestPartOfDay,
  focusOnly,
  formatDuration,
  last7Days,
  streakDays,
  todaySeconds,
  totalFocusSeconds,
  weekSeconds,
} from '../state/insights';
import { Txt } from '../components/Txt';
import { Card } from '../components/Card';
import { WeekChart } from '../components/WeekChart';
import { SessionRow } from '../components/SessionRow';

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <Card style={styles.stat}>
      <Txt token="displayMd" color={colors.ink} style={styles.statValue}>
        {value}
      </Txt>
      <Txt token="caption" color={colors.inkMuted48}>
        {label}
      </Txt>
    </Card>
  );
}

export function InsightsScreen() {
  const { sessions } = useStore();
  const layout = useLayout();

  const today = todaySeconds(sessions);
  const week = weekSeconds(sessions);
  const streak = streakDays(sessions);
  const total = totalFocusSeconds(sessions);
  const focusCount = focusOnly(sessions).length;
  const best = bestPartOfDay(sessions);
  const week7 = last7Days(sessions);
  const recent = sessions.slice(0, 30);

  const empty = focusCount === 0;

  return (
    <ScrollView style={styles.fill} showsVerticalScrollIndicator={false}>
      {/* Today hero (parchment) */}
      <View style={styles.hero}>
        <View style={styles.inner}>
          <Txt token="bodyStrong" color={colors.primary}>
            Today
          </Txt>
          <Txt token="heroDisplay" color={colors.ink} size={layout.heroSize} style={styles.bigNum}>
            {formatDuration(today)}
          </Txt>
          <Txt token="lead" color={colors.inkMuted80}>
            {formatDuration(week)} this week
          </Txt>
          <Txt token="caption" color={colors.inkMuted48} style={styles.heroMeta}>
            {formatDuration(total)} focused all time
          </Txt>
        </View>
      </View>

      {/* Body (white) */}
      <View style={styles.body}>
        <View style={styles.inner}>
          {empty ? (
            <Card style={styles.emptyCard}>
              <Txt token="bodyStrong" color={colors.ink}>
                Your focus journal starts here.
              </Txt>
              <Txt token="body" color={colors.inkMuted48} style={styles.emptyBody}>
                Finish a focus block and your time, streak, and reflections will appear on this
                screen.
              </Txt>
            </Card>
          ) : (
            <>
              <View style={styles.statRow}>
                <Stat value={`${streak}`} label="day streak" />
                <Stat value={`${focusCount}`} label={focusCount === 1 ? 'session' : 'sessions'} />
              </View>

              <Card style={styles.section}>
                <Txt token="bodyStrong" color={colors.ink} style={styles.sectionTitle}>
                  Last 7 days
                </Txt>
                <WeekChart data={week7} />
              </Card>

              {best && (
                <Card style={styles.section}>
                  <Txt token="caption" color={colors.inkMuted48}>
                    You focus best in the
                  </Txt>
                  <Txt token="displayMd" color={colors.ink} style={styles.bestValue}>
                    {best}
                  </Txt>
                </Card>
              )}

              <View style={styles.section}>
                <Txt token="bodyStrong" color={colors.ink} style={styles.sectionTitle}>
                  Journal
                </Txt>
                <Card>
                  {recent.map((s, i) => (
                    <View key={s.id}>
                      {i > 0 && <View style={styles.divider} />}
                      <SessionRow session={s} />
                    </View>
                  ))}
                </Card>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.canvas },
  hero: {
    backgroundColor: colors.canvasParchment,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  inner: { width: '100%', maxWidth: 720, alignSelf: 'center' },
  bigNum: { fontFamily: fontFamily.light, marginVertical: spacing.xs },
  heroMeta: { marginTop: spacing.xxs },
  body: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.lg,
  },
  statRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  stat: { flex: 1, paddingVertical: spacing.md, paddingHorizontal: spacing.md },
  statValue: { fontFamily: fontFamily.light, marginBottom: 2 },
  section: { marginBottom: spacing.lg },
  sectionTitle: { marginBottom: spacing.md },
  bestValue: { marginTop: spacing.xxs },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline },
  emptyCard: { alignItems: 'flex-start' },
  emptyBody: { marginTop: spacing.xs },
});
