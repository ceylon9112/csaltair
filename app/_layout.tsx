/* eslint-disable import/no-duplicates -- RNGH needs side-effect import before named imports */
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
/* eslint-enable import/no-duplicates */
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider as NavThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useMemo } from 'react';
import type { ViewStyle } from 'react-native';
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  useColorScheme as useSystemScheme,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import 'react-native-reanimated';

import { usePreferencesStore } from '@/store/preferencesStore';
import { AppProviders } from '@/providers/AppProviders';
import { initNotificationsForCurrentPlatform } from '@/services/notifications/initNotifications';

export { ErrorBoundary } from 'expo-router';

enableScreens(true);

/** Native only: keep splash until fonts + tree are ready. Web has no native splash. */
if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

/** Web: empty map → `useFonts` resolves immediately (no TTF / icon-font preload issues). */
const fontsNative = {
  SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  ...FontAwesome.font,
};

export default function RootLayout() {
  const [loaded, error] = useFonts(Platform.OS === 'web' ? {} : fontsNative);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded && Platform.OS !== 'web') {
      void SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    void initNotificationsForCurrentPlatform();
  }, []);

  if (!loaded) {
    return (
      <View style={[styles.bootShell, webRootFill]} accessibilityLabel="Loading app">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const Root = Platform.OS === 'web' ? View : GestureHandlerRootView;

  return (
    <Root style={[styles.rootShell, webRootFill]}>
      <AppProviders>
        <RootNav />
      </AppProviders>
    </Root>
  );
}

const styles = StyleSheet.create({
  bootShell: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootShell: {
    flex: 1,
  },
});

const webRootFill: ViewStyle | undefined =
  Platform.OS === 'web'
    ? ({
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        flex: 1,
      } as unknown as ViewStyle)
    : undefined;

function RootNav() {
  const highContrast = usePreferencesStore((s) => s.highContrast);
  const system = useSystemScheme();
  const dark = highContrast ? true : system === 'dark';
  const { width, height } = useWindowDimensions();

  /** ExpoRoot sets SafeArea frame to 0×0 on web; native stack uses useSafeAreaFrame() → invisible UI. */
  const webSafeAreaMetrics = useMemo(
    () => ({
      frame: { x: 0, y: 0, width, height },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }),
    [width, height]
  );

  const stack = (
    <Stack
      screenOptions={{
        animation: 'default',
        contentStyle: { flex: 1 },
      }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );

  return (
    <NavThemeProvider value={dark ? DarkTheme : DefaultTheme}>
      {Platform.OS === 'web' ? (
        <SafeAreaProvider initialMetrics={webSafeAreaMetrics}>{stack}</SafeAreaProvider>
      ) : (
        stack
      )}
    </NavThemeProvider>
  );
}
