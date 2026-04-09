import { Link } from 'expo-router';
import React, { useMemo } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';
import { useScheduleStore } from '@/store/scheduleStore';
import { useReviewStore } from '@/store/reviewStore';
import { usePreferencesStore } from '@/store/preferencesStore';
import type { Performance } from '@/types/models';
import { ALL_FESTIVAL_DAYS, formatDayLabel } from '@/utils/festivalDates';
import { formatPerformanceRange } from '@/utils/time';
import { findOverlapsFor } from '@/utils/overlap';

export default function ScheduleScreen() {
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const saved = useScheduleStore((s) => s.saved);
  const removePerformance = useScheduleStore((s) => s.removePerformance);
  const setReminder = useScheduleStore((s) => s.setReminder);
  const reviews = useReviewStore((s) => s.reviews);
  const defaultRem = usePreferencesStore((s) => s.reminderDefaultMinutes);

  const grouped = useMemo(() => {
    if (!bundle) return [];
    const entries = Object.keys(saved)
      .map((id) => bundle.performances.find((p) => p.id === id))
      .filter(Boolean) as Performance[];
    const byDay: Record<string, Performance[]> = {};
    for (const d of ALL_FESTIVAL_DAYS) byDay[d] = [];
    for (const p of entries) {
      byDay[p.date] = byDay[p.date] ?? [];
      byDay[p.date].push(p);
    }
    return ALL_FESTIVAL_DAYS.map((d) => ({
      day: d,
      items: (byDay[d] ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)),
    })).filter((g) => g.items.length > 0);
  }, [bundle, saved]);

  if (!bundle) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <AppText>Loading…</AppText>
      </SafeAreaView>
    );
  }

  const allSaved = Object.keys(saved)
    .map((id) => bundle.performances.find((p) => p.id === id))
    .filter(Boolean) as Performance[];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: 8 }}>
        <AppText variant="title">My schedule</AppText>
        <AppText variant="caption" style={{ marginTop: 6, color: theme.colors.textSecondary }}>
          Saved on this device only · reminders are local notifications
        </AppText>
      </View>
      {grouped.length === 0 ? (
        <View style={{ padding: theme.spacing.lg, alignItems: 'center' }}>
          <AppText variant="subtitle" style={{ textAlign: 'center' }}>
            No saved shows yet
          </AppText>
          <AppText variant="body" style={{ textAlign: 'center', marginTop: 8, color: theme.colors.textSecondary }}>
            Browse the lineup and tap a performance to save it.
          </AppText>
          <Link href="/lineup" asChild>
            <PrimaryButton title="Browse lineup" style={{ marginTop: 16 }} />
          </Link>
        </View>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.day}
          contentContainerStyle={{ paddingHorizontal: theme.spacing.md, paddingBottom: 40 }}
          renderItem={({ item: g }) => (
            <View style={{ marginBottom: theme.spacing.lg }}>
              <AppText variant="subtitle" accessibilityRole="header">
                {formatDayLabel(g.day)}
              </AppText>
              {g.items.map((p) => {
                const artist = bundle.artists.find((a) => a.id === p.artistId);
                const meta = saved[p.id];
                const overlaps = findOverlapsFor(
                  p,
                  allSaved.filter((x) => x.id !== p.id)
                );
                const rev = reviews[p.id];
                return (
                  <Card key={p.id} style={{ marginTop: theme.spacing.sm }}>
                    <AppText variant="subtitle">{artist?.name}</AppText>
                    <AppText variant="caption" style={{ marginTop: 4 }}>
                      {formatPerformanceRange(p.date, p.startTime, p.endTime)} · {p.stageName}
                    </AppText>
                    <AppText variant="caption" style={{ marginTop: 6 }}>
                      Reminder: {meta?.reminderOffsetMinutes ?? defaultRem} min before
                    </AppText>
                    {overlaps.length ? (
                      <AppText style={{ color: theme.colors.danger, marginTop: 6, fontWeight: '700' }}>
                        Overlaps with: {overlaps.map((o) => o.stageName).join(', ')}
                      </AppText>
                    ) : null}
                    {rev ? (
                      <AppText variant="caption" style={{ marginTop: 6 }}>
                        Your rating: {rev.rating}★ {rev.note ? `· ${rev.note}` : ''}
                      </AppText>
                    ) : null}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                      <Pressable
                        accessibilityRole="button"
                        onPress={() =>
                          setReminder(p.id, 15, artist?.name ?? 'Show')
                        }>
                        <AppText variant="caption" style={{ fontWeight: '700', color: theme.colors.tint }}>
                          Remind 15m
                        </AppText>
                      </Pressable>
                      <Pressable onPress={() => setReminder(p.id, 30, artist?.name ?? 'Show')}>
                        <AppText variant="caption" style={{ fontWeight: '700', color: theme.colors.tint }}>
                          30m
                        </AppText>
                      </Pressable>
                      <Pressable onPress={() => setReminder(p.id, 60, artist?.name ?? 'Show')}>
                        <AppText variant="caption" style={{ fontWeight: '700', color: theme.colors.tint }}>
                          60m
                        </AppText>
                      </Pressable>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                      <Link href={`/performance/${p.id}/review`} asChild>
                        <PrimaryButton title={rev ? 'Edit review' : 'Rate show'} variant="ghost" />
                      </Link>
                      <PrimaryButton
                        title="Remove"
                        variant="ghost"
                        onPress={() => void removePerformance(p.id)}
                      />
                      <Link href={`/performance/${p.id}`} asChild>
                        <PrimaryButton title="Details" variant="ghost" />
                      </Link>
                    </View>
                  </Card>
                );
              })}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
