import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { type as typeTokens, TypeToken } from '../theme/typography';
import { colors } from '../theme/tokens';

type Props = TextProps & {
  /** Typography token from the design ladder. */
  token: TypeToken;
  /** Optional color override; defaults to near-black Ink. */
  color?: string;
  /** Optional per-instance font size override (used by responsive headlines). */
  size?: number;
  align?: TextStyle['textAlign'];
};

/** Single text primitive — guarantees every string uses a real typography token. */
export function Txt({ token, color = colors.ink, size, align, style, ...rest }: Props) {
  const base = typeTokens[token];
  return (
    <Text
      style={[
        base,
        { color },
        size != null ? { fontSize: size } : null,
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    />
  );
}
