import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Layout } from '../theme/responsive';
import { WatchConfig, resolveConfig } from '../data/config';
import { bandColorOptions } from '../data/catalog';
import { ProductTile } from '../components/ProductTile';
import { WatchRender } from '../components/WatchRender';
import { StoreHeroButton } from '../components/Buttons';
import { Footer } from '../components/Footer';
import { Txt } from '../components/Txt';

type Props = {
  layout: Layout;
  config: WatchConfig;
  onConfigure: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
};

/** A live watch sized for a tile, driven by a (possibly showcase) config. */
function TileWatch({ cfg, layout, big }: { cfg: WatchConfig; layout: Layout; big?: boolean }) {
  const r = resolveConfig(cfg);
  const width = Math.min(layout.width * (big ? 0.62 : 0.46), big ? 250 : 190);
  return (
    <WatchRender
      width={width}
      caseColor={r.caseOpt.hex}
      caseSheen={r.caseOpt.sheen}
      bandColor={r.bandColorOpt.hex}
      bandStyle={r.bandStyleOpt.style}
      face={r.faceOpt.face}
    />
  );
}

// Showcase configurations used to give each feature tile its own character.
const SHOWCASE_DISPLAY: WatchConfig = {
  caseId: 'ti-slate', sizeId: 's45', bandStyleId: 'solid', bandColorId: 'b-black', faceId: 'modular',
};
const SHOWCASE_TITANIUM: WatchConfig = {
  caseId: 'ti-gold', sizeId: 's45', bandStyleId: 'link', bandColorId: 'b-stone', faceId: 'minimal',
};
const SHOWCASE_HEALTH: WatchConfig = {
  caseId: 'alu-midnight', sizeId: 's41', bandStyleId: 'sport', bandColorId: 'b-sage', faceId: 'analog',
};

export function OverviewScreen({ layout, config, onConfigure, scrollRef }: Props) {
  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      {/* 1 — Hero (light) with the user's live, configured watch */}
      <ProductTile
        variant="light"
        eyebrow="New"
        title="NOVA Watch"
        tagline="Your whole day, on your wrist. Live."
        headingSize={layout.heroSize}
        sectionPadV={layout.sectionPadV}
        onLearn={onConfigure}
        onBuy={onConfigure}
      >
        <TileWatch cfg={config} layout={layout} big />
      </ProductTile>

      {/* 2 — Always-on display (dark) */}
      <ProductTile
        variant="dark"
        title="Always-on Retina display."
        tagline="Brighter, edge-to-edge, and always telling time."
        headingSize={layout.tileHeadingSize}
        sectionPadV={layout.sectionPadV}
        onLearn={onConfigure}
        onBuy={onConfigure}
      >
        <TileWatch cfg={SHOWCASE_DISPLAY} layout={layout} />
      </ProductTile>

      {/* 3 — Titanium (parchment) */}
      <ProductTile
        variant="parchment"
        title="Titanium. Featherlight."
        tagline="Aerospace-grade and impossibly thin."
        headingSize={layout.tileHeadingSize}
        sectionPadV={layout.sectionPadV}
        onLearn={onConfigure}
        onBuy={onConfigure}
      >
        <TileWatch cfg={SHOWCASE_TITANIUM} layout={layout} />
      </ProductTile>

      {/* 4 — Health (dark2, micro-step lighter) */}
      <ProductTile
        variant="dark2"
        title="Health, measured."
        tagline="Heart rhythm, sleep stages, and beyond."
        headingSize={layout.tileHeadingSize}
        sectionPadV={layout.sectionPadV}
        onLearn={onConfigure}
        onBuy={onConfigure}
      >
        <TileWatch cfg={SHOWCASE_HEALTH} layout={layout} />
      </ProductTile>

      {/* 5 — Bands (light) with a swatch row */}
      <ProductTile
        variant="light"
        title="A band for every you."
        tagline="Swap looks in a second."
        showCtas={false}
        headingSize={layout.tileHeadingSize}
        sectionPadV={layout.sectionPadV}
      >
        <View style={styles.swatchRow}>
          {bandColorOptions.map((b) => (
            <View key={b.id} style={styles.swatchItem}>
              <View style={[styles.swatch, { backgroundColor: b.hex }]} />
              <Txt token="caption" color={colors.inkMuted48} style={styles.swatchLabel}>
                {b.name}
              </Txt>
            </View>
          ))}
        </View>
      </ProductTile>

      {/* 6 — Configure CTA (parchment, store-hero button) */}
      <ProductTile
        variant="parchment"
        eyebrow="Make it yours"
        title="Configure your NOVA."
        tagline="Case, size, band, and face — see it update live."
        showCtas={false}
        headingSize={layout.tileHeadingSize}
        sectionPadV={layout.sectionPadV}
      >
        <View style={styles.heroCta}>
          <StoreHeroButton label="Configure" onPress={onConfigure} />
        </View>
      </ProductTile>

      <Footer compact={layout.isCompact} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    maxWidth: 520,
  },
  swatchItem: {
    alignItems: 'center',
    width: 76,
  },
  swatch: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.hairlineSoft,
    marginBottom: spacing.xs,
  },
  swatchLabel: {
    textAlign: 'center',
  },
  heroCta: {
    marginTop: spacing.xs,
  },
});
