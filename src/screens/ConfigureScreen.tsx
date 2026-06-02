import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, spacing } from '../theme/tokens';
import { CONTENT_MAX, Layout } from '../theme/responsive';
import {
  WatchConfig,
  deltaLabel,
  formatPrice,
  resolveConfig,
} from '../data/config';
import {
  bandColorOptions,
  bandStyleOptions,
  caseOptions,
  faceOptions,
  Option,
  sizeOptions,
} from '../data/catalog';
import { WatchRender } from '../components/WatchRender';
import { OptionChip } from '../components/OptionChip';
import { FloatingBar } from '../components/FloatingBar';
import { Footer } from '../components/Footer';
import { Txt } from '../components/Txt';

type Props = {
  layout: Layout;
  config: WatchConfig;
  update: (patch: Partial<WatchConfig>) => void;
  onAdd: () => void;
  scrollRef?: React.RefObject<ScrollView | null>;
};

function ChipGroup<T extends Option>({
  label,
  options,
  selectedId,
  onSelect,
  swatchOf,
}: {
  label: string;
  options: T[];
  selectedId: string;
  onSelect: (id: string) => void;
  swatchOf?: (o: T) => string | undefined;
}) {
  return (
    <View style={styles.group}>
      <Txt token="bodyStrong" color={colors.ink} style={styles.groupLabel}>
        {label}
      </Txt>
      <View style={styles.chips}>
        {options.map((o) => (
          <OptionChip
            key={o.id}
            label={o.name}
            meta={deltaLabel(o.delta)}
            swatch={swatchOf?.(o)}
            selected={selectedId === o.id}
            onPress={() => onSelect(o.id)}
          />
        ))}
      </View>
    </View>
  );
}

export function ConfigureScreen({ layout, config, update, onAdd, scrollRef }: Props) {
  const r = resolveConfig(config);
  const watchWidth = Math.min(layout.width * 0.58, 240);

  const summary = `${r.caseOpt.name} · ${r.sizeOpt.name} · ${r.bandStyleOpt.name} · ${r.bandColorOpt.name}`;

  return (
    <View style={styles.fill}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Live preview hero (parchment) */}
        <View style={[styles.preview, { paddingVertical: layout.sectionPadV * 0.6 }]}>
          <WatchRender
            width={watchWidth}
            caseColor={r.caseOpt.hex}
            caseSheen={r.caseOpt.sheen}
            bandColor={r.bandColorOpt.hex}
            bandStyle={r.bandStyleOpt.style}
            face={r.faceOpt.face}
          />
          <Txt
            token="displayMd"
            color={colors.ink}
            size={layout.tileHeadingSize - 6}
            align="center"
            style={styles.previewTitle}
          >
            Configure your NOVA.
          </Txt>
          <Txt token="caption" color={colors.inkMuted48} align="center" style={styles.summary}>
            {summary}
          </Txt>
          <Txt token="tagline" color={colors.ink} align="center" style={styles.previewPrice}>
            {formatPrice(r.total)}
          </Txt>
        </View>

        {/* Option groups (white canvas) */}
        <View style={styles.options}>
          <ChipGroup
            label="Size"
            options={sizeOptions}
            selectedId={config.sizeId}
            onSelect={(id) => update({ sizeId: id })}
          />
          <ChipGroup
            label="Case"
            options={caseOptions}
            selectedId={config.caseId}
            onSelect={(id) => update({ caseId: id })}
            swatchOf={(o) => o.hex}
          />
          <ChipGroup
            label="Band"
            options={bandStyleOptions}
            selectedId={config.bandStyleId}
            onSelect={(id) => update({ bandStyleId: id })}
          />
          <ChipGroup
            label="Band color"
            options={bandColorOptions}
            selectedId={config.bandColorId}
            onSelect={(id) => update({ bandColorId: id })}
            swatchOf={(o) => o.hex}
          />
          <ChipGroup
            label="Watch face"
            options={faceOptions}
            selectedId={config.faceId}
            onSelect={(id) => update({ faceId: id })}
          />
        </View>

        <Footer compact={layout.isCompact} />
      </ScrollView>

      <FloatingBar
        priceLabel={formatPrice(r.total)}
        caption={`${r.sizeOpt.name} · From ${formatPrice(r.total)}`}
        onAdd={onAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  scroll: {
    paddingBottom: 96, // clear the floating sticky bar
  },
  preview: {
    backgroundColor: colors.canvasParchment,
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  previewTitle: {
    marginTop: spacing.xl,
  },
  summary: {
    marginTop: spacing.xs,
    maxWidth: 420,
  },
  previewPrice: {
    marginTop: spacing.sm,
  },
  options: {
    width: '100%',
    maxWidth: CONTENT_MAX,
    alignSelf: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    gap: spacing.xl,
  },
  group: {
    gap: spacing.sm,
  },
  groupLabel: {
    marginBottom: spacing.xxs,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});
