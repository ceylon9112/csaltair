import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { LayoutAnimation, Pressable, ScrollView, UIManager, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const artist = bundle?.artists.find((a) => a.id === id);

  const [bioOpen, setBioOpen] = React.useState(false);

  if (!bundle || !artist) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <AppText>Artist not found.</AppText>
      </SafeAreaView>
    );
  }

  const performances = bundle.performances.filter((p) => artist.performanceIds.includes(p.id));

  return (
    <>
      <Stack.Screen options={{ title: artist.name }} />
      <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Image
          source={{ uri: artist.imageUrl }}
          accessibilityLabel={`Photo of ${artist.name}`}
          style={{ width: '100%', height: 240 }}
          contentFit="cover"
        />
        <View style={{ padding: theme.spacing.md }}>
          <AppText variant="title">{artist.name}</AppText>
          <AppText variant="subtitle" style={{ marginTop: 8, color: theme.colors.tint }}>
            {artist.genre}
          </AppText>

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: bioOpen }}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              setBioOpen((o) => !o);
            }}
            style={{ marginTop: theme.spacing.md }}>
            <Card>
              <AppText variant="subtitle">Bio {bioOpen ? '−' : '+'}</AppText>
              {bioOpen ? (
                <AppText variant="body" style={{ marginTop: 8 }}>
                  {artist.shortBio}
                </AppText>
              ) : (
                <AppText variant="caption" numberOfLines={2} style={{ marginTop: 8 }}>
                  {artist.shortBio}
                </AppText>
              )}
            </Card>
          </Pressable>

          <Card style={{ marginTop: theme.spacing.md }}>
            <AppText variant="subtitle">Discography highlights</AppText>
            {artist.discography.map((line) => (
              <AppText key={line} variant="body" style={{ marginTop: 6 }}>
                · {line}
              </AppText>
            ))}
          </Card>

          {artist.awards.length ? (
            <Card style={{ marginTop: theme.spacing.md }}>
              <AppText variant="subtitle">Awards & recognition</AppText>
              {artist.awards.map((line) => (
                <AppText key={line} variant="body" style={{ marginTop: 6 }}>
                  · {line}
                </AppText>
              ))}
            </Card>
          ) : null}

          <AppText variant="label" style={{ marginTop: theme.spacing.lg, marginBottom: 8 }}>
            PERFORMANCES
          </AppText>
          {performances.map((p) => (
            <Link key={p.id} href={`/performance/${p.id}`} asChild>
              <Pressable>
                <Card style={{ marginBottom: theme.spacing.sm }}>
                  <AppText variant="subtitle">
                    {p.date} · {p.startTime} – {p.endTime}
                  </AppText>
                  <AppText variant="caption" style={{ marginTop: 4 }}>
                    {p.stageName}
                  </AppText>
                </Card>
              </Pressable>
            </Link>
          ))}
        </View>
      </ScrollView>
    </>
  );
}
