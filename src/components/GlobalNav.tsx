import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme/tokens';
import { Section, SECTIONS } from '../navigation';
import { Txt } from './Txt';
import { Icon } from './Icon';

type Props = {
  active: Section;
  onNavigate: (s: Section) => void;
  navCollapsed: boolean;
  bagCount: number;
  onOpenBag: () => void;
};

/**
 * global-nav — persistent ultra-thin true-black bar (the only pure black on the page).
 * Full horizontal link row on desktop; collapses to brand + hamburger + bag <= 833px.
 */
export function GlobalNav({ active, onNavigate, navCollapsed, bagCount, onOpenBag }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.bar}>
        {/* Brand */}
        <Pressable
          onPress={() => {
            onNavigate('overview');
            setMenuOpen(false);
          }}
          hitSlop={8}
        >
          <Txt token="tagline" color={colors.bodyOnDark} style={styles.brand}>
            NOVA
          </Txt>
        </Pressable>

        {/* Desktop link row */}
        {!navCollapsed && (
          <View style={styles.links}>
            {SECTIONS.map((s) => (
              <Pressable key={s.id} onPress={() => onNavigate(s.id)} hitSlop={6}>
                <Txt
                  token="navLink"
                  color={active === s.id ? colors.bodyOnDark : colors.bodyMuted}
                >
                  {s.label}
                </Txt>
              </Pressable>
            ))}
          </View>
        )}

        {/* Right cluster */}
        <View style={styles.right}>
          <Pressable onPress={() => onNavigate('accessories')} hitSlop={8} style={styles.iconBtn}>
            <Icon name="search" size={18} color={colors.bodyOnDark} />
          </Pressable>

          <Pressable onPress={onOpenBag} hitSlop={8} style={styles.bag}>
            <Icon name="bag" size={18} color={colors.bodyOnDark} />
            {bagCount > 0 && (
              <View style={styles.badge}>
                <Txt token="microLegal" color={colors.canvas}>
                  {bagCount}
                </Txt>
              </View>
            )}
          </Pressable>

          {navCollapsed && (
            <Pressable onPress={() => setMenuOpen((o) => !o)} hitSlop={8} style={styles.iconBtn}>
              <Icon name={menuOpen ? 'close' : 'menu'} size={20} color={colors.bodyOnDark} />
            </Pressable>
          )}
        </View>
      </View>

      {/* Collapsed tray */}
      {navCollapsed && menuOpen && (
        <View style={styles.tray}>
          {SECTIONS.map((s) => (
            <Pressable
              key={s.id}
              onPress={() => {
                onNavigate(s.id);
                setMenuOpen(false);
              }}
              style={styles.trayRow}
            >
              <Txt
                token="tagline"
                color={active === s.id ? colors.bodyOnDark : colors.bodyMuted}
              >
                {s.label}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surfaceBlack,
    zIndex: 30,
  },
  bar: {
    height: 44,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    letterSpacing: 2,
  },
  links: {
    flexDirection: 'row',
    gap: spacing.lg,
    flex: 1,
    justifyContent: 'center',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconBtn: {
    padding: 2,
  },
  bag: {
    padding: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    minWidth: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tray: {
    backgroundColor: colors.surfaceBlack,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.12)',
  },
  trayRow: {
    paddingVertical: spacing.sm,
  },
});
