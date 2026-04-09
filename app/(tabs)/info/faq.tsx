import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';

export default function FaqScreen() {
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const sections = bundle?.infoSections.filter((s) => s.category === 'faq') ?? [];

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
        <AppText variant="title">FAQ</AppText>
        <View style={{ marginTop: theme.spacing.md, gap: theme.spacing.sm }}>
          {sections.map((s) => (
            <Card key={s.id}>
              <AppText variant="subtitle">{s.title}</AppText>
              <AppText variant="body" style={{ marginTop: 8 }}>
                {s.body}
              </AppText>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
