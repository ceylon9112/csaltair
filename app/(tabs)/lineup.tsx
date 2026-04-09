import { Link } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import type { Performance } from '@/types/models';
import { ALL_FESTIVAL_DAYS, formatDayLabel } from '@/utils/festivalDates';
import {
  isPerformanceHappeningNow,
  isStartingWithinMinutes,
  formatPerformanceRange,
} from '@/utils/time';
import { contentRepository } from '@/services/content/ContentRepository';
import { useScheduleStore } from '@/store/scheduleStore';
import { findOverlapsFor } from '@/utils/overlap';

type Segment = 'now' | 'soon' | 'full';

export default function LineupScreen() {
  const { theme } = useAppTheme();
  const { data, isLoading } = useContentBundle();
  const saved = useScheduleStore((s) => s.saved);
  const [day, setDay] = useState(ALL_FESTIVAL_DAYS[0]);
  const [stageId, setStageId] = useState<string | null>(null);
  const [segment, setSegment] = useState<Segment>('full');
  const [q, setQ] = useState('');

  const bundle = data ? contentRepository.getBundleSync() : null;

  const filtered = useMemo(() => {
    if (!bundle) return [];
    let list = bundle.performances.filter((p) => p.date === day);
    if (stageId) list = list.filter((p) => p.stageId === stageId);
    const now = new Date();
    if (segment === 'now') {
      list = list.filter((p) => isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now));
    } else if (segment === 'soon') {
      list = list.filter((p) => isStartingWithinMinutes(p.date, p.startTime, 90, now));
    }
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((p) => {
        const a = bundle.artists.find((x) => x.id === p.artistId);
        return a?.name.toLowerCase().includes(needle);
      });
    }
    list = [...list].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return list;
  }, [bundle, day, stageId, segment, q]);

  const artistResults = useMemo(() => {
    if (!bundle || !q.trim()) return [];
    const needle = q.trim().toLowerCase();
    return bundle.artists.filter((a) => a.name.toLowerCase().includes(needle)).slice(0, 20);
  }, [bundle, q]);

  if (isLoading || !bundle) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" accessibilityLabel="Loading lineup" />
      </SafeAreaView>
    );
  }

  const stages = bundle.stages;
  const performances = bundle.performances;

  function conflictFor(p: Performance): boolean {
    const savedPerfs = Object.keys(saved)
      .map((id) => performances.find((x) => x.id === id))
      .filter(Boolean) as Performance[];
    return findOverlapsFor(p, savedPerfs).length > 0;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: theme.spacing.md, paddingBottom: theme.spacing.sm }}>
          <AppText variant="title">Lineup</AppText>
          <TextInput
            accessibilityLabel="Search artists"
            placeholder="Search artists"
            placeholderTextColor={theme.colors.textSecondary}
            value={q}
            onChangeText={setQ}
            style={{
              marginTop: theme.spacing.md,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.md,
              padding: 12,
              minHeight: 48,
              backgroundColor: theme.colors.surface,
              color: theme.colors.text,
              fontSize: 16,
            }}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 44 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: theme.spacing.md, gap: 8 }}>
            {ALL_FESTIVAL_DAYS.map((d) => {
              const active = d === day;
              return (
                <Pressable
                  key={d}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  onPress={() => setDay(d)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: theme.radii.full,
                    backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}>
                  <AppText
                    variant="caption"
                    style={{ fontWeight: '600', color: active ? theme.colors.primaryText : theme.colors.text }}>
                    {formatDayLabel(d)}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8, maxHeight: 40 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: theme.spacing.md, gap: 8, flexWrap: 'wrap' }}>
            <Pressable
              onPress={() => setStageId(null)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: theme.radii.md,
                backgroundColor: stageId === null ? theme.colors.tint : theme.colors.surface,
              }}>
              <AppText variant="caption" style={{ color: stageId === null ? '#fff' : theme.colors.text }}>
                All stages
              </AppText>
            </Pressable>
            {stages.map((s) => {
              const active = stageId === s.id;
              return (
                <Pressable
                  key={s.id}
                  onPress={() => setStageId(s.id)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: theme.radii.md,
                    backgroundColor: active ? theme.colors.tint : theme.colors.surface,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}>
                  <AppText variant="caption" style={{ color: active ? '#fff' : theme.colors.text }}>
                    {s.name}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ flexDirection: 'row', paddingHorizontal: theme.spacing.md, marginTop: 12, gap: 8 }}>
          {(['now', 'soon', 'full'] as Segment[]).map((seg) => {
            const active = segment === seg;
            return (
              <Pressable
                key={seg}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                onPress={() => setSegment(seg)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: theme.radii.md,
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: theme.colors.border,
                  alignItems: 'center',
                }}>
                <AppText variant="caption" style={{ fontWeight: '700', color: active ? theme.colors.primaryText : theme.colors.text }}>
                  {seg === 'now' ? 'Now' : seg === 'soon' ? 'Soon' : 'Full day'}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {q.trim() && artistResults.length > 0 ? (
          <View style={{ paddingHorizontal: theme.spacing.md, marginTop: 12 }}>
            <AppText variant="label" style={{ marginBottom: 8 }}>
              ARTIST MATCHES
            </AppText>
            {artistResults.map((a) => (
              <Link key={a.id} href={`/artist/${a.id}`} asChild>
                <Pressable style={{ paddingVertical: 8 }}>
                  <AppText variant="subtitle">{a.name}</AppText>
                </Pressable>
              </Link>
            ))}
          </View>
        ) : null}

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 40 }}
          ListEmptyComponent={
            <AppText style={{ textAlign: 'center', marginTop: 24 }}>No performances match filters.</AppText>
          }
          renderItem={({ item: p }) => {
            const artist = bundle.artists.find((a) => a.id === p.artistId);
            const zone = bundle.mapZones.find((z) => z.id === p.mapZoneId);
            const savedFlag = !!saved[p.id];
            const conflict = savedFlag ? false : conflictFor(p);
            return (
              <Link href={`/performance/${p.id}`} asChild>
                <Pressable accessibilityRole="button">
                  <Card style={{ marginBottom: theme.spacing.sm }}>
                    <AppText variant="subtitle">{artist?.name ?? 'Artist'}</AppText>
                    <AppText variant="caption" style={{ marginTop: 4 }}>
                      {formatPerformanceRange(p.date, p.startTime, p.endTime)}
                    </AppText>
                    <AppText variant="caption" style={{ marginTop: 4 }}>
                      {p.stageName} · Map: {zone?.name ?? p.mapZoneId}
                    </AppText>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
                      {savedFlag ? (
                        <AppText variant="caption" style={{ fontWeight: '700' }}>
                          Saved
                        </AppText>
                      ) : null}
                      {conflict ? (
                        <AppText variant="caption" style={{ color: theme.colors.danger, fontWeight: '700' }}>
                          Overlaps saved show
                        </AppText>
                      ) : null}
                    </View>
                  </Card>
                </Pressable>
              </Link>
            );
          }}
        />
      </SafeAreaView>
    </View>
  );
}
