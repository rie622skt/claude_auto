import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { type as typeTokens } from '../theme/typography';
import { Icon } from './Icon';

type Props = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
};

/** search-input — pill-shaped (matches CTA grammar), hairline border, leading glyph. */
export function SearchInput({ value, onChangeText, placeholder = 'Search accessories' }: Props) {
  return (
    <View style={styles.wrap}>
      <Icon name="search" size={16} color={colors.inkMuted48} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.inkMuted48}
        style={styles.input}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    height: 44,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.hairlineSoft,
    backgroundColor: colors.canvas,
  },
  input: {
    flex: 1,
    ...typeTokens.body,
    color: colors.ink,
    padding: 0,
  },
});
