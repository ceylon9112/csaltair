import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';

const OFFICIAL_TICKETS_URL = 'https://www.nojazzfest.com/tickets/'; // TODO: confirm 2026 URL

function statusLabel(s: string): string {
  switch (s) {
    case 'on_sale':
      return 'On sale';
    case 'waitlist':
      return 'Waitlist';
    case 'sold_out':
      return 'Sold out';
    case 'limited':
      return 'Limited';
    case 'coming_soon':
      return 'Coming soon';
    default:
      return s;
  }
}

export default function TicketsScreen() {
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;

  if (!bundle) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AppText>Loading…</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 48 }}>
        <AppText variant="title">Tickets</AppText>
        <AppText variant="body" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
          Pricing snapshot only — no in-app checkout. Confirm on official channels before purchase.
        </AppText>

        {bundle.ticketTypes.map((t) => (
          <Card key={t.id} style={{ marginTop: theme.spacing.md }}>
            <AppText variant="subtitle">{t.name}</AppText>
            <AppText variant="caption" style={{ marginTop: 4 }}>
              {t.tier}
            </AppText>
            <AppText variant="title" style={{ marginTop: 8 }}>
              {t.price}
            </AppText>
            <AppText style={{ marginTop: 8, fontWeight: '700', color: theme.colors.tint }}>
              {statusLabel(t.availabilityStatus)}
            </AppText>
            <AppText variant="body" style={{ marginTop: 8 }}>
              {t.notes}
            </AppText>
          </Card>
        ))}

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Child ticket policy (summary)</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Children’s ticket rules vary by age/height — see official ticketing FAQ. (Placeholder.)
          </AppText>
        </Card>

        <Pressable
          accessibilityRole="link"
          onPress={() => WebBrowser.openBrowserAsync(OFFICIAL_TICKETS_URL)}
          style={{ marginTop: theme.spacing.lg, minHeight: 48, justifyContent: 'center' }}>
          <AppText style={{ color: theme.colors.tint, fontWeight: '700' }}>Open official ticket page</AppText>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
