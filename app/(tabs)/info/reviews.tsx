import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';
import { useReviewStore } from '@/store/reviewStore';

export default function MyReviewsScreen() {
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const reviews = useReviewStore((s) => s.reviews);

  if (!bundle) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AppText>Loading…</AppText>
      </SafeAreaView>
    );
  }

  const entries = Object.values(reviews);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 48 }}>
        <AppText variant="title">My reviews</AppText>
        <AppText variant="caption" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
          Stored only on this device. Not shared publicly in MVP.
        </AppText>

        {entries.length === 0 ? (
          <AppText style={{ marginTop: 24 }}>No reviews yet. Rate a show from a performance or your schedule.</AppText>
        ) : (
          <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
            {entries.map((r) => {
              const perf = bundle.performances.find((p) => p.id === r.performanceId);
              const artist = perf ? bundle.artists.find((a) => a.id === perf.artistId) : undefined;
              return (
                <Link key={r.performanceId} href={`/performance/${r.performanceId}/review`} asChild>
                  <Pressable>
                    <Card>
                      <AppText variant="subtitle">{artist?.name ?? 'Show'}</AppText>
                      <AppText variant="body" style={{ marginTop: 8 }}>
                        {r.rating}★ {r.note ? `— ${r.note}` : ''}
                      </AppText>
                    </Card>
                  </Pressable>
                </Link>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
