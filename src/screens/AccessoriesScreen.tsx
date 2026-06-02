import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { CONTENT_MAX, Layout } from '../theme/responsive';
import { accessories } from '../data/catalog';
import { SearchInput } from '../components/SearchInput';
import { StoreCard } from '../components/StoreCard';
import { Footer } from '../components/Footer';
import { Txt } from '../components/Txt';

type Props = {
  layout: Layout;
  onBuy: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
};

export function AccessoriesScreen({ layout, onBuy, scrollRef }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return accessories;
    return accessories.filter(
      (a) => a.name.toLowerCase().includes(q) || a.category.toLowerCase().includes(q),
    );
  }, [query]);

  // Responsive grid math: container locks at CONTENT_MAX, gutters 24px.
  const gutter = spacing.lg;
  const padH = spacing.lg;
  const containerW = Math.min(layout.width, CONTENT_MAX) - padH * 2;
  const cols = layout.gridColumns;
  const cardWidth =
    cols <= 1 ? containerW : Math.floor((containerW - gutter * (cols - 1)) / cols);

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Hero (parchment) + search */}
      <View style={[styles.hero, { paddingVertical: layout.sectionPadV * 0.6 }]}>
        <View style={styles.heroInner}>
          <Txt token="displayLg" color={colors.ink} size={layout.tileHeadingSize}>
            Accessories.
          </Txt>
          <Txt token="lead" color={colors.inkMuted80} style={styles.heroSub}>
            Bands, charging, and protection — designed in lockstep.
          </Txt>
          <View style={styles.searchWrap}>
            <SearchInput value={query} onChangeText={setQuery} />
          </View>
        </View>
      </View>

      {/* Grid (white canvas) */}
      <View style={styles.gridSection}>
        <View style={styles.gridInner}>
          <Txt token="caption" color={colors.inkMuted48} style={styles.count}>
            {results.length} {results.length === 1 ? 'item' : 'items'}
          </Txt>
          <View style={[styles.grid, { gap: gutter }]}>
            {results.map((a) => (
              <StoreCard key={a.id} accessory={a} width={cardWidth} onBuy={onBuy} />
            ))}
          </View>
          {results.length === 0 && (
            <Txt token="body" color={colors.inkMuted48} style={styles.empty}>
              No accessories match “{query}”.
            </Txt>
          )}
        </View>
      </View>

      <Footer compact={layout.isCompact} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: 0,
  },
  hero: {
    backgroundColor: colors.canvasParchment,
    paddingHorizontal: spacing.lg,
  },
  heroInner: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
  },
  heroSub: {
    marginTop: spacing.sm,
    maxWidth: 560,
  },
  searchWrap: {
    marginTop: spacing.lg,
    maxWidth: 440,
  },
  gridSection: {
    backgroundColor: colors.canvas,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  gridInner: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
  },
  count: {
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  empty: {
    marginTop: spacing.lg,
  },
});
