import React, { useCallback, useEffect, useState } from 'react';
import { Platform, SafeAreaView, StatusBar as RNStatusBar, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { Inter_300Light } from '@expo-google-fonts/inter/300Light';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';

import { colors } from './src/theme/tokens';
import { StoreProvider, useStore } from './src/state/store';
import { setHapticsEnabled } from './src/state/haptics';
import { AppHeader } from './src/components/AppHeader';
import { FocusScreen } from './src/screens/FocusScreen';
import { InsightsScreen } from './src/screens/InsightsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

type Route = 'focus' | 'insights' | 'settings';

function Root() {
  const { ready, settings } = useStore();
  const [route, setRoute] = useState<Route>('focus');
  const [immersive, setImmersive] = useState(false);

  useEffect(() => {
    setHapticsEnabled(settings.haptics);
  }, [settings.haptics]);

  const goFocus = useCallback(() => setRoute('focus'), []);

  // The header hides only during an active focus session (route === 'focus').
  const showHeader = route !== 'focus' || !immersive;

  if (!ready) return <View style={styles.boot} />;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="light" />
      {showHeader &&
        (route === 'focus' ? (
          <AppHeader
            mode="home"
            onInsights={() => setRoute('insights')}
            onSettings={() => setRoute('settings')}
          />
        ) : (
          <AppHeader
            mode="sub"
            title={route === 'insights' ? 'Insights' : 'Settings'}
            onBack={goFocus}
          />
        ))}

      <View style={styles.body}>
        {route === 'focus' && <FocusScreen onImmersive={setImmersive} />}
        {route === 'insights' && <InsightsScreen />}
        {route === 'settings' && <SettingsScreen />}
      </View>
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_300Light,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  if (!fontsLoaded) return <View style={styles.boot} />;
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  boot: { flex: 1, backgroundColor: colors.canvas },
  body: { flex: 1 },
});
