import { parseISO, format } from 'date-fns';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';

export default function AlertsScreen() {
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const now = new Date();

  if (!bundle) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AppText>Loading…</AppText>
      </SafeAreaView>
    );
  }

  const active = bundle.alerts.filter(
    (a) => now >= parseISO(a.effectiveAt) && now <= parseISO(a.expiresAt)
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 48 }}>
        <AppText variant="title">Alerts center</AppText>
        <AppText variant="caption" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
          Local / mock alerts in MVP. TODO: merge remote push payloads here in V2.
        </AppText>

        {active.length === 0 ? (
          <AppText style={{ marginTop: 24 }}>No active alerts.</AppText>
        ) : (
          <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
            {active.map((a) => (
              <Card key={a.id} accessibilityRole="text">
                <AppText variant="subtitle">{a.title}</AppText>
                <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                  {format(parseISO(a.effectiveAt), 'MMM d, h:mm a')} –{' '}
                  {format(parseISO(a.expiresAt), 'MMM d, h:mm a')}
                </AppText>
                <AppText variant="body" style={{ marginTop: 8 }}>
                  {a.body}
                </AppText>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
