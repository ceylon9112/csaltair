import { Link } from 'expo-router';
import { parseISO, format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AlertBanner } from '@/components/home/AlertBanner';
import { WeatherWidget } from '@/components/home/WeatherWidget';
import { QuickAction } from '@/components/home/QuickAction';
import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { usePreferencesStore } from '@/store/preferencesStore';
import type { Performance } from '@/types/models';
import { currentFestivalDayOrDefault, formatDayLabel } from '@/utils/festivalDates';
import { isPerformanceHappeningNow, isStartingWithinMinutes, formatPerformanceRange } from '@/utils/time';
import { contentRepository } from '@/services/content/ContentRepository';

export default function HomeScreen() {
  const { theme } = useAppTheme();
  const { data, isLoading, isError } = useContentBundle();
  const lastSyncedAt = usePreferencesStore((s) => s.lastSyncedAt);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, []);

  const festDay = currentFestivalDayOrDefault(new Date());

  const { happening, soon, activeAlert } = useMemo(() => {
    void tick;
    const now = new Date();
    if (!data) {
      return { happening: [] as Performance[], soon: [] as Performance[], activeAlert: null };
    }
    const happening = data.performances.filter((p) =>
      isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now)
    );
    const soon = data.performances.filter(
      (p) =>
        !isPerformanceHappeningNow(p.date, p.startTime, p.endTime, now) &&
        isStartingWithinMinutes(p.date, p.startTime, 60, now)
    );
    const alerts = data.alerts.filter(
      (a) => now >= parseISO(a.effectiveAt) && now <= parseISO(a.expiresAt)
    );
    const activeAlert = alerts[0] ?? null;
    return { happening, soon, activeAlert };
  }, [data, tick]);

  if (isLoading || !data) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center' }}>
        <ActivityIndicator accessibilityLabel="Loading festival content" size="large" />
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
        <AppText>Could not load content. Pull to refresh when online.</AppText>
      </SafeAreaView>
    );
  }

  const bundle = contentRepository.getBundleSync();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      contentContainerStyle={{ paddingBottom: 32 }}>
      <SafeAreaView edges={['top']} style={{ paddingHorizontal: theme.spacing.md }}>
        <View style={{ marginTop: theme.spacing.md, marginBottom: theme.spacing.lg }}>
          <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>
            Jazz Fest 2026 · Guest mode · offline-ready
          </AppText>
          <AppText variant="title" style={{ marginTop: 8 }}>
            New Orleans Jazz & Heritage Festival
          </AppText>
          <AppText variant="body" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
            Today on site: {formatDayLabel(festDay)}
          </AppText>
          {lastSyncedAt ? (
            <AppText variant="caption" style={{ marginTop: 6 }}>
              Content cached: {format(parseISO(lastSyncedAt), 'MMM d, h:mm a')}
            </AppText>
          ) : null}
        </View>

        <View style={{ marginBottom: theme.spacing.md }}>
          <WeatherWidget />
        </View>

        {activeAlert ? (
          <View style={{ marginBottom: theme.spacing.md }}>
            <AlertBanner alert={activeAlert} />
          </View>
        ) : null}

        <Card style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="subtitle">Happening now</AppText>
          {happening.length === 0 ? (
            <AppText variant="body" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
              No performances in this time window (sample data). Browse the lineup.
            </AppText>
          ) : (
            happening.map((p) => {
              const artist = bundle.artists.find((a) => a.id === p.artistId);
              return (
                <Link key={p.id} href={`/performance/${p.id}` as const} asChild>
                  <Pressable style={{ marginTop: 12 }}>
                    <AppText variant="subtitle">{artist?.name ?? 'Artist'}</AppText>
                    <AppText variant="caption">
                      {p.stageName} · {p.startTime}–{p.endTime}
                    </AppText>
                  </Pressable>
                </Link>
              );
            })
          )}
        </Card>

        <Card style={{ marginBottom: theme.spacing.md }}>
          <AppText variant="subtitle">Starting soon (60 min)</AppText>
          {soon.length === 0 ? (
            <AppText variant="body" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
              Nothing starting in the next hour on the sample clock.
            </AppText>
          ) : (
            soon.map((p) => {
              const artist = bundle.artists.find((a) => a.id === p.artistId);
              return (
                <Link key={p.id} href={`/performance/${p.id}` as const} asChild>
                  <Pressable style={{ marginTop: 12 }}>
                    <AppText variant="subtitle">{artist?.name ?? 'Artist'}</AppText>
                    <AppText variant="caption">{formatPerformanceRange(p.date, p.startTime, p.endTime)}</AppText>
                  </Pressable>
                </Link>
              );
            })
          )}
        </Card>

        <AppText variant="label" style={{ marginBottom: theme.spacing.sm, color: theme.colors.textSecondary }}>
          QUICK LINKS
        </AppText>
        <AppText variant="caption" style={{ marginBottom: theme.spacing.md, color: theme.colors.textSecondary }}>
          Jump to common tasks — one tap each.
        </AppText>
        <View style={{ gap: theme.spacing.sm }}>
          <QuickAction
            href="/lineup"
            icon="music"
            label="Browse full lineup"
            hint="Opens festival lineup with search and filters"
            description="Every announced act, by day and stage — search or filter to plan your day."
          />
          <QuickAction
            href="/map"
            icon="map"
            label="Festival map"
            hint="Opens festival map"
            description="Stages, amenities, and zones — static map for the Fair Grounds."
          />
          <QuickAction
            href="/schedule"
            icon="calendar"
            label="My schedule"
            hint="Opens saved shows"
            description="Shows you’ve saved and reminder settings — stored on this device only."
          />
          <QuickAction
            href="/info/accessibility"
            icon="wheelchair"
            label="Accessibility hub"
            hint="Accessibility hub"
            description="Mobility, viewing areas, ASL, and festival access info."
          />
          <QuickAction
            href="/info/tickets"
            icon="ticket"
            label="Tickets & pricing"
            hint="Ticket information"
            description="Types of passes and links to official ticket sales."
          />
          <QuickAction
            href="/info/festival"
            icon="info-circle"
            label="Festival hours & policies"
            hint="Hours and policies"
            description="Gate times, re-entry notes, and what to expect on site."
          />
          <QuickAction
            href="/info"
            icon="list"
            label="All info topics"
            hint="Opens info hub"
            description="Health, parking, FAQ, alerts, reviews, and settings."
          />
        </View>

        <View style={{ height: theme.spacing.lg }} />
        <AppText variant="caption" style={{ color: theme.colors.textSecondary }}>
          Lineup reflects 2026 public announcements; confirm final set times on nojazzfest.com. Artist photos are placeholders until licensed assets are available.
        </AppText>
      </SafeAreaView>
    </ScrollView>
  );
}
