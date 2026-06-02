import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar as RNStatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
// Import each weight from its subpath so Metro only bundles the four faces we use
// (importing from the package root would eagerly pull in all 18 Inter weights).
import { useFonts } from 'expo-font';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

import { colors, radius, spacing } from './src/theme/tokens';
import { useLayout } from './src/theme/responsive';
import { Section } from './src/navigation';
import { GlobalNav } from './src/components/GlobalNav';
import { SubNav } from './src/components/SubNav';
import { Txt } from './src/components/Txt';
import { OverviewScreen } from './src/screens/OverviewScreen';
import { ConfigureScreen } from './src/screens/ConfigureScreen';
import { AccessoriesScreen } from './src/screens/AccessoriesScreen';
import { WatchConfig, defaultConfig } from './src/data/config';

/** Lightweight transient toast — confirms a bag add without leaving the surface. */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start();
  }, [visible, opacity]);
  return (
    <Animated.View pointerEvents="none" style={[styles.toast, { opacity }]}>
      <Txt token="caption" color={colors.bodyOnDark}>
        {message}
      </Txt>
    </Animated.View>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const layout = useLayout();
  const [active, setActive] = useState<Section>('overview');
  const [config, setConfig] = useState<WatchConfig>(defaultConfig);
  const [bagCount, setBagCount] = useState(0);
  const [toast, setToast] = useState<{ msg: string; on: boolean }>({ msg: '', on: false });

  const scrollRef = useRef<ScrollView>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigate = useCallback((s: Section) => {
    setActive(s);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  }, []);

  const updateConfig = useCallback(
    (patch: Partial<WatchConfig>) => setConfig((c) => ({ ...c, ...patch })),
    [],
  );

  const showToast = useCallback((msg: string) => {
    setToast({ msg, on: true });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, on: false })), 1800);
  }, []);

  const addWatchToBag = useCallback(() => {
    setBagCount((n) => n + 1);
    showToast('NOVA Watch added to Bag');
  }, [showToast]);

  const addAccessoryToBag = useCallback(() => {
    setBagCount((n) => n + 1);
    showToast('Added to Bag');
  }, [showToast]);

  if (!fontsLoaded) {
    return <View style={styles.boot} />;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />

      {/* Fixed header: global nav + frosted sub-nav */}
      <GlobalNav
        active={active}
        onNavigate={navigate}
        navCollapsed={layout.navCollapsed}
        bagCount={bagCount}
        onOpenBag={() => showToast(bagCount ? `${bagCount} item(s) in Bag` : 'Your Bag is empty')}
      />
      <SubNav
        active={active}
        onNavigate={navigate}
        navCollapsed={layout.navCollapsed}
        onBuy={() => navigate('configure')}
      />

      {/* Active surface */}
      <View style={styles.body}>
        {active === 'overview' && (
          <OverviewScreen
            layout={layout}
            config={config}
            onConfigure={() => navigate('configure')}
            scrollRef={scrollRef}
          />
        )}
        {active === 'configure' && (
          <ConfigureScreen
            layout={layout}
            config={config}
            update={updateConfig}
            onAdd={addWatchToBag}
            scrollRef={scrollRef}
          />
        )}
        {active === 'accessories' && (
          <AccessoriesScreen layout={layout} onBuy={addAccessoryToBag} scrollRef={scrollRef} />
        )}
      </View>

      <Toast message={toast.msg} visible={toast.on} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  boot: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  body: {
    flex: 1,
  },
  toast: {
    position: 'absolute',
    bottom: 96,
    alignSelf: 'center',
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    zIndex: 40,
  },
});
