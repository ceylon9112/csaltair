import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useContentBundle } from '@/hooks/useContentQuery';
import { useAppTheme } from '@/theme/ThemeContext';
import { contentRepository } from '@/services/content/ContentRepository';
import { useReviewStore, REVIEW_NOTE_MAX } from '@/store/reviewStore';

export default function ReviewScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { theme } = useAppTheme();
  const { data } = useContentBundle();
  const bundle = data ? contentRepository.getBundleSync() : null;
  const perf = bundle?.performances.find((p) => p.id === id);
  const artist = perf ? bundle?.artists.find((a) => a.id === perf.artistId) : undefined;
  const existing = useReviewStore((s) => (id ? s.reviews[id] : undefined));
  const upsert = useReviewStore((s) => s.upsertReview);

  const [rating, setRating] = useState(existing?.rating ?? 4);
  const [note, setNote] = useState(existing?.note ?? '');

  if (!bundle || !perf || !artist) {
    return (
      <SafeAreaView style={{ flex: 1, padding: 16 }}>
        <AppText>Performance not found.</AppText>
      </SafeAreaView>
    );
  }

  const remaining = REVIEW_NOTE_MAX - note.length;

  return (
    <>
      <Stack.Screen options={{ title: 'Your review' }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
        <View style={{ padding: theme.spacing.md, flex: 1 }}>
          <AppText variant="subtitle">
            {artist.name} · {perf.startTime}
          </AppText>
          <AppText variant="caption" style={{ marginTop: 8, color: theme.colors.textSecondary }}>
            Private on this device only — not shared publicly in MVP.
          </AppText>

          <AppText variant="label" style={{ marginTop: 24, marginBottom: 8 }}>
            STARS (1–5)
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pressable
                key={n}
                accessibilityRole="radio"
                accessibilityState={{ selected: rating === n }}
                accessibilityLabel={`${n} stars`}
                onPress={() => setRating(n)}
                style={{
                  minWidth: 48,
                  minHeight: 48,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: rating === n ? theme.colors.tint : theme.colors.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.colors.surface,
                }}>
                <AppText variant="subtitle">{n}</AppText>
              </Pressable>
            ))}
          </View>

          <AppText variant="label" style={{ marginTop: 24, marginBottom: 8 }}>
            NOTE (OPTIONAL, {REVIEW_NOTE_MAX} CHARS MAX)
          </AppText>
          <TextInput
            multiline
            maxLength={REVIEW_NOTE_MAX}
            value={note}
            onChangeText={setNote}
            accessibilityLabel="Short review note"
            placeholder="How was the set?"
            placeholderTextColor={theme.colors.textSecondary}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radii.md,
              padding: 12,
              minHeight: 100,
              textAlignVertical: 'top',
              color: theme.colors.text,
              backgroundColor: theme.colors.surface,
            }}
          />
          <AppText variant="caption" style={{ marginTop: 6, color: theme.colors.textSecondary }}>
            {remaining} characters left
          </AppText>

          <View style={{ marginTop: 'auto', paddingTop: 24 }}>
            <PrimaryButton
              title="Save review"
              onPress={() => {
                upsert(perf.id, rating, note);
                router.back();
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
