import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Alert, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';
import { useScheduleStore } from '@/store/scheduleStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import { formatPerformanceRange } from '@/utils/time';
import { findOverlapsFor } from '@/utils/overlap';

export default function PerformanceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const savePerformance = useScheduleStore((s) => s.savePerformance);
  const removePerformance = useScheduleStore((s) => s.removePerformance);
  const savedMap = useScheduleStore((s) => s.saved);
  const defaultRem = usePreferencesStore((s) => s.reminderDefaultMinutes);

  const perf = bundle?.performances.find((p) => p.id === id);
  const artist = perf ? bundle?.artists.find((a) => a.id === perf.artistId) : undefined;
  const zone = perf ? bundle?.mapZones.find((z) => z.id === perf.mapZoneId) : undefined;

  const saved = perf ? !!savedMap[perf.id] : false;

  const overlaps = React.useMemo(() => {
    if (!bundle || !perf) return [];
    const savedPerfs = Object.keys(savedMap)
      .map((pid) => bundle.performances.find((x) => x.id === pid))
      .filter(Boolean)
      .filter((p) => p!.id !== perf.id) as typeof bundle.performances;
    return findOverlapsFor(perf, savedPerfs);
  }, [bundle, perf, savedMap]);

  if (!bundle || !perf || !artist) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <AppText>Performance not found.</AppText>
      </SafeAreaView>
    );
  }

  async function onSave() {
    if (!perf || !artist) return;
    try {
      await savePerformance(perf, defaultRem, artist.name);
      Alert.alert('Saved', 'We will remind you based on your notification settings.');
    } catch {
      Alert.alert('Could not save', 'Try again or check notification permissions in Settings.');
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: artist.name }} />
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Image
          source={{ uri: artist.imageUrl }}
          style={{ width: '100%', height: 220 }}
          contentFit="cover"
          accessibilityLabel={`Photo: ${artist.name}`}
        />
        <View style={{ padding: theme.spacing.md }}>
          <AppText variant="title">{artist.name}</AppText>
          <AppText variant="subtitle" style={{ marginTop: 6, color: theme.colors.tint }}>
            {artist.genre}
          </AppText>
          <AppText variant="body" style={{ marginTop: 12 }}>
            {formatPerformanceRange(perf.date, perf.startTime, perf.endTime)}
          </AppText>
          <AppText variant="body" style={{ marginTop: 4 }}>
            {perf.stageName}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
            Map zone: {zone?.name ?? perf.mapZoneId}
          </AppText>

          {overlaps.length ? (
            <Card style={{ marginTop: theme.spacing.md, borderColor: theme.colors.danger }}>
              <AppText style={{ color: theme.colors.danger, fontWeight: '700' }}>
                Overlap warning: you have another saved show at this time.
              </AppText>
            </Card>
          ) : null}

          <View style={{ marginTop: theme.spacing.lg, gap: 12 }}>
            {saved ? (
              <PrimaryButton title="Remove from schedule" onPress={() => void removePerformance(perf.id)} />
            ) : (
              <PrimaryButton title="Save to My Schedule" onPress={() => void onSave()} />
            )}
            <Link href={`/performance/${perf.id}/review`} asChild>
              <PrimaryButton title="Rate this show" variant="ghost" />
            </Link>
            <Link href={`/artist/${artist.id}`} asChild>
              <PrimaryButton title="Full artist bio" variant="ghost" />
            </Link>
            <PrimaryButton
              title="View on map"
              variant="ghost"
              onPress={() => router.push('/map')}
            />
          </View>

          <Card style={{ marginTop: theme.spacing.lg }}>
            <AppText variant="subtitle">Short bio</AppText>
            <AppText variant="body" style={{ marginTop: 8 }}>
              {artist.shortBio}
            </AppText>
          </Card>
        </View>
      </ScrollView>
    </>
  );
}
