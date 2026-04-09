import { Link } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useAppTheme } from '@/theme/ThemeContext';

const rows: { href: string; label: string; icon: React.ComponentProps<typeof FontAwesome>['name']; hint: string }[] = [
  { href: '/info/accessibility', label: 'Accessibility hub', icon: 'wheelchair', hint: 'Accessibility information' },
  { href: '/info/tickets', label: 'Tickets & pricing', icon: 'ticket', hint: 'Official ticket snapshot' },
  { href: '/info/festival', label: 'Festival information', icon: 'info-circle', hint: 'Hours and policies' },
  { href: '/info/health', label: 'Health & safety', icon: 'heartbeat', hint: 'Health guidance' },
  { href: '/info/parking', label: 'Parking & shuttle', icon: 'bus', hint: 'Getting to the fairgrounds' },
  { href: '/info/faq', label: 'FAQ', icon: 'question-circle', hint: 'Common questions' },
  { href: '/info/alerts', label: 'Alerts center', icon: 'bell', hint: 'Operational alerts' },
  { href: '/info/reviews', label: 'My reviews', icon: 'star', hint: 'Your local ratings' },
  { href: '/info/settings', label: 'Settings', icon: 'cog', hint: 'Notifications and display' },
];

export default function InfoHubScreen() {
  const { theme } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 40 }}>
        <AppText variant="title">Info</AppText>
        <AppText variant="body" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
          Guest mode — everything here works offline after first load.
        </AppText>

        <View style={{ marginTop: theme.spacing.lg, gap: theme.spacing.sm }}>
          {rows.map((r) => (
            <Link key={r.href} href={r.href as '/info/settings'} asChild>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={r.label}
                accessibilityHint={r.hint}>
                <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <FontAwesome name={r.icon} size={22} color={theme.colors.tint} accessibilityElementsHidden />
                  <AppText variant="subtitle" style={{ flex: 1 }}>
                    {r.label}
                  </AppText>
                  <FontAwesome name="chevron-right" size={14} color={theme.colors.textSecondary} />
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
