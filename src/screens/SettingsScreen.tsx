import React, { useState } from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { useStore } from '../state/store';
import { haptic } from '../state/haptics';
import { Txt } from '../components/Txt';
import { Card } from '../components/Card';
import { Chip } from '../components/Chip';
import { GhostPill, PrimaryButton } from '../components/Buttons';

const DURATIONS = [15, 25, 45, 60];

function ToggleRow({
  title,
  description,
  value,
  onValueChange,
}: {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleText}>
        <Txt token="bodyStrong" color={colors.ink}>
          {title}
        </Txt>
        <Txt token="caption" color={colors.inkMuted48}>
          {description}
        </Txt>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: '#d6d6db' }}
        thumbColor={colors.canvas}
        ios_backgroundColor="#d6d6db"
      />
    </View>
  );
}

export function SettingsScreen() {
  const { settings, setSettings, resetData } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <ScrollView style={styles.fill} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.inner}>
        <Txt token="bodyStrong" color={colors.ink} style={styles.label}>
          Default focus length
        </Txt>
        <View style={styles.chips}>
          {DURATIONS.map((d) => (
            <Chip
              key={d}
              label={`${d} min`}
              selected={settings.defaultMin === d}
              onPress={() => {
                haptic.selection();
                setSettings({ defaultMin: d });
              }}
            />
          ))}
        </View>

        <Card style={styles.group}>
          <ToggleRow
            title="Breathing settle"
            description="A short paced breath before each focus block."
            value={settings.breathing}
            onValueChange={(v) => setSettings({ breathing: v })}
          />
          <View style={styles.divider} />
          <ToggleRow
            title="Haptics"
            description="Subtle taps on start, breath, and completion."
            value={settings.haptics}
            onValueChange={(v) => setSettings({ haptics: v })}
          />
        </Card>

        <Card style={styles.group}>
          <Txt token="bodyStrong" color={colors.ink}>
            Reset all data
          </Txt>
          <Txt token="caption" color={colors.inkMuted48} style={styles.resetBody}>
            Permanently clears every session and reflection on this device. This can’t be undone.
          </Txt>
          {confirmReset ? (
            <View style={styles.confirmRow}>
              <GhostPill label="Cancel" onPress={() => setConfirmReset(false)} />
              <PrimaryButton
                label="Reset"
                onPress={() => {
                  resetData();
                  setConfirmReset(false);
                }}
              />
            </View>
          ) : (
            <View style={styles.resetBtn}>
              <GhostPill label="Reset" onPress={() => setConfirmReset(true)} />
            </View>
          )}
        </Card>

        <Txt token="caption" color={colors.inkMuted48} style={styles.about}>
          Cadence keeps everything on your device — no account, no network. It’s a calm companion
          for doing one thing at a time, and a quiet record of the focus you’ve already done.
        </Txt>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: colors.canvasParchment },
  content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
  inner: { width: '100%', maxWidth: 640, alignSelf: 'center' },
  label: { marginBottom: spacing.sm },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.xl },
  group: { marginBottom: spacing.lg },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    gap: spacing.md,
  },
  toggleText: { flex: 1, gap: 2 },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.hairline, marginVertical: spacing.md },
  resetBody: { marginTop: spacing.xxs },
  resetBtn: { marginTop: spacing.md, alignItems: 'flex-start' },
  confirmRow: { marginTop: spacing.md, flexDirection: 'row', gap: spacing.sm },
  about: { marginTop: spacing.md, lineHeight: 22 },
});
