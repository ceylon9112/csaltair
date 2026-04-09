import { format, parseISO } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useAppTheme } from '@/theme/ThemeContext';
import { fetchFairGroundsCurrentWeather, type CurrentWeatherResult } from '@/utils/weather/openMeteo';

const REFRESH_MS = 15 * 60 * 1000;

export function WeatherWidget() {
  const { theme } = useAppTheme();
  const [state, setState] = useState<CurrentWeatherResult | null>(null);

  const runFetch = useCallback((signal: AbortSignal) => {
    fetchFairGroundsCurrentWeather(signal).then(setState);
  }, []);

  useEffect(() => {
    const ac = new AbortController();
    runFetch(ac.signal);
    const id = setInterval(() => {
      const next = new AbortController();
      runFetch(next.signal);
    }, REFRESH_MS);
    return () => {
      ac.abort();
      clearInterval(id);
    };
  }, [runFetch]);

  const onRefresh = useCallback(() => {
    const ac = new AbortController();
    runFetch(ac.signal);
  }, [runFetch]);

  const timeLabel =
    state?.ok === true
      ? (() => {
          try {
            return `Updated ${format(parseISO(state.time), 'h:mm a')}`;
          } catch {
            return null;
          }
        })()
      : null;

  return (
    <Card
      accessibilityRole="none"
      accessibilityLabel={
        state?.ok
          ? `Fair Grounds weather: ${Math.round(state.temperatureF)} degrees Fahrenheit, ${state.description}`
          : 'Fair Grounds weather loading or unavailable'
      }>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <AppText variant="subtitle">Fair Grounds weather</AppText>
          <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }}>
            New Orleans — today (Open-Meteo)
          </AppText>
        </View>
        {state === null ? (
          <ActivityIndicator accessibilityLabel="Loading weather" color={theme.colors.tint} />
        ) : null}
      </View>

      {state?.ok ? (
        <View style={{ marginTop: theme.spacing.md, flexDirection: 'row', alignItems: 'center' }}>
          <AppText style={{ fontSize: 36, lineHeight: 42, marginRight: 12 }} accessibilityElementsHidden>
            {state.emoji}
          </AppText>
          <View style={{ flex: 1 }}>
            <AppText variant="title" style={{ fontSize: 28 }}>
              {Math.round(state.temperatureF)}°F
            </AppText>
            <AppText variant="body" style={{ marginTop: 4 }}>
              {state.description}
            </AppText>
            {state.humidityPercent != null ? (
              <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                Humidity {Math.round(state.humidityPercent)}%
              </AppText>
            ) : null}
            {timeLabel ? (
              <AppText variant="caption" style={{ marginTop: 6, color: theme.colors.textSecondary }}>
                {timeLabel}
              </AppText>
            ) : null}
          </View>
        </View>
      ) : state && !state.ok && state.error !== 'Cancelled' ? (
        <AppText variant="body" style={{ marginTop: theme.spacing.md, color: theme.colors.textSecondary }}>
          {state.error}. Tap refresh to try again.
        </AppText>
      ) : null}

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Refresh weather"
        onPress={onRefresh}
        style={{ marginTop: theme.spacing.md, alignSelf: 'flex-start', paddingVertical: 8, paddingHorizontal: 4 }}>
        <AppText variant="caption" style={{ color: theme.colors.tint, fontWeight: '600' }}>
          Refresh
        </AppText>
      </Pressable>
    </Card>
  );
}
