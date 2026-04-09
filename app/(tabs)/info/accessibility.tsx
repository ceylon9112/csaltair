import React from 'react';
import { Linking, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useAppTheme } from '@/theme/ThemeContext';

export default function AccessibilityHubScreen() {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 48 }}>
        <AppText variant="title">Accessibility</AppText>
        <AppText variant="body" style={{ marginTop: 12, color: theme.colors.textSecondary }}>
          Strong screen reader labels are used across the app. Use Settings for high contrast and larger text.
        </AppText>

        <Card style={{ marginTop: theme.spacing.lg }}>
          <AppText variant="subtitle">Overview</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Jazz Fest strives to welcome all patrons. This screen summarizes common accessibility topics — confirm
            details with official festival staff and signage on site. (Placeholder copy.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Accessible viewing areas</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Designated viewing areas may be available near major stages — arrive early and ask staff for the Access
            Center. TODO: verify 2026 locations.
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Access Center</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            On-site hub for accessibility questions, services, and assistive listening distribution (placeholder).
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Accessible parking</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Official accessible parking policies are published before the festival — check the official site and
            follow staff directions. (Placeholder.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Shuttle accessibility</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Shuttle vehicles and boarding procedures vary — confirm with official transportation pages. (Placeholder.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">ASL interpreted performances</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            A sample schedule of interpreted sets may be published — watch official channels. (Placeholder — not a
            live schedule in MVP.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Assistive listening</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Receivers may be available at the Access Center — ID deposit sometimes required. (Placeholder.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Service animals</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Service animals trained to assist an individual are generally accommodated — follow official festival
            policy. (Placeholder — not legal advice.)
          </AppText>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Contact</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            TODO: insert official accessibility email/phone when available.
          </AppText>
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open placeholder accessibility info link"
            onPress={() => Linking.openURL('https://www.nojazzfest.com')}
            style={{ marginTop: 12, minHeight: 44, justifyContent: 'center' }}>
            <AppText style={{ color: theme.colors.tint, fontWeight: '700' }}>Official site (external)</AppText>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
