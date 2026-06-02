import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { DayBar } from '../state/insights';
import { Txt } from './Txt';

const BAR_AREA = 132;
const MIN_VISIBLE = 3; // a sliver so empty days still read as a column

/** Last-7-days focused minutes. Bars are plain Views — crisp at any density. */
export function WeekChart({ data }: { data: DayBar[] }) {
  const max = Math.max(...data.map((d) => d.minutes), 1);

  return (
    <View>
      <View style={styles.row}>
        {data.map((d) => {
          const h = d.minutes > 0 ? Math.max(MIN_VISIBLE, (d.minutes / max) * BAR_AREA) : MIN_VISIBLE;
          const filled = d.minutes > 0;
          return (
            <View key={d.key} style={styles.col}>
              <View style={styles.barArea}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: h,
                      backgroundColor: filled
                        ? d.isToday
                          ? colors.primary
                          : 'rgba(0,102,204,0.45)'
                        : colors.hairline,
                    },
                  ]}
                />
              </View>
              <Txt
                token="caption"
                color={d.isToday ? colors.ink : colors.inkMuted48}
                align="center"
              >
                {d.label}
              </Txt>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  col: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
  },
  barArea: {
    height: BAR_AREA,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 22,
    borderRadius: radius.sm,
  },
});
