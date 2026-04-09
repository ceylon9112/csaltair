import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FestivalMapView } from '@/components/map/FestivalMapView';
import { AppText } from '@/components/common/AppText';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
export default function MapScreen() {
  const { theme } = useAppTheme();
  const { data, isLoading } = useContentBundle();

  if (isLoading || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
        <AppText>Loading map…</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ flex: 1, paddingHorizontal: theme.spacing.md, paddingTop: theme.spacing.md }}>
        <AppText variant="title">Festival map</AppText>
        <AppText variant="caption" style={{ marginTop: 8, color: theme.colors.textSecondary, marginBottom: 12 }}>
          Full accessibility map image (legend, stages, restrooms, viewing areas). No overlays — pinch/zoom to read
          detail. No GPS.
        </AppText>
        <FestivalMapView />
      </View>
    </SafeAreaView>
  );
}
