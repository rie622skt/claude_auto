import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { CONTENT_MAX } from '../theme/responsive';
import { Txt } from './Txt';

const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: 'Shop NOVA Watch', links: ['Watch', 'Bands', 'Charging', 'Compare', 'Trade In'] },
  { heading: 'Services', links: ['NOVA Care', 'Fitness+', 'Family Setup', 'Cellular Plans'] },
  { heading: 'Account', links: ['Manage Your ID', 'NOVA Store Account', 'iCloud'] },
  { heading: 'About NOVA', links: ['Newsroom', 'Leadership', 'Careers', 'Investors', 'Environment'] },
];

type Props = { compact: boolean };

/**
 * footer — parchment, deliberately dense. Link columns use the relaxed 2.41
 * leading (denseLink) that lets the columns breathe; the only place the system
 * abandons its generous whitespace to expose the full information architecture.
 */
export function Footer({ compact }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.inner}>
        <Txt token="finePrint" color={colors.inkMuted48} style={styles.crumb}>
          NOVA Store ▸ Watch ▸ Configure
        </Txt>

        <View style={[styles.columns, compact && styles.columnsCompact]}>
          {COLUMNS.map((col) => (
            <View key={col.heading} style={[styles.col, compact && styles.colCompact]}>
              <Txt token="captionStrong" color={colors.ink} style={styles.heading}>
                {col.heading}
              </Txt>
              {col.links.map((l) => (
                <Pressable key={l} hitSlop={4}>
                  <Txt token="denseLink" color={colors.inkMuted80}>
                    {l}
                  </Txt>
                </Pressable>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.legalDivider} />

        <Txt token="finePrint" color={colors.inkMuted48} style={styles.legal}>
          NOVA Watch is a fictional product built to demonstrate a design system.
          Times shown are your device's live clock.
        </Txt>
        <Txt token="microLegal" color={colors.inkMuted48}>
          Copyright {new Date().getFullYear()} NOVA. All rights reserved. · Privacy Policy ·
          Terms of Use · Sales and Refunds · Legal · Site Map
        </Txt>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.canvasParchment,
    paddingVertical: 64,
    paddingHorizontal: spacing.lg,
  },
  inner: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
  },
  crumb: {
    marginBottom: spacing.lg,
  },
  columns: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
  },
  columnsCompact: {
    gap: spacing.lg,
  },
  col: {
    minWidth: 160,
    flexGrow: 1,
    flexBasis: 0,
  },
  colCompact: {
    flexBasis: '40%',
    minWidth: 130,
  },
  heading: {
    marginBottom: spacing.xxs,
  },
  legalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.hairline,
    marginVertical: spacing.lg,
  },
  legal: {
    marginBottom: spacing.xs,
  },
});
