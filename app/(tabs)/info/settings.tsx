import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppText } from '@/components/common/AppText';
import { Card } from '@/components/common/Card';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { useAppTheme } from '@/theme/ThemeContext';
import type { TextScaleOption } from '@/theme/tokens';
import { requestPermissionsIfNeededAsync } from '@/services/notifications/NotificationService';
import { clearAllLocalDataAsync } from '@/services/storage/clearLocalData';
import { usePreferencesStore, type ReminderDefault } from '@/store/preferencesStore';

export default function SettingsScreen() {
  const { theme } = useAppTheme();
  const highContrast = usePreferencesStore((s) => s.highContrast);
  const setHighContrast = usePreferencesStore((s) => s.setHighContrast);
  const textScale = usePreferencesStore((s) => s.textScale);
  const setTextScale = usePreferencesStore((s) => s.setTextScale);
  const notificationsEnabled = usePreferencesStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((s) => s.setNotificationsEnabled);
  const reminderDefault = usePreferencesStore((s) => s.reminderDefaultMinutes);
  const setReminderDefault = usePreferencesStore((s) => s.setReminderDefault);
  const [busy, setBusy] = useState(false);

  async function onRequestNotif() {
    const ok = await requestPermissionsIfNeededAsync();
    Alert.alert(ok ? 'Notifications enabled' : 'Permission needed', ok ? 'You can adjust in system settings anytime.' : 'Enable notifications in system settings for reminders.');
  }

  async function onClear() {
    Alert.alert(
      'Clear local data?',
      'Removes saved schedule, reviews, and preferences on this device.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setBusy(true);
            try {
              await clearAllLocalDataAsync();
              Alert.alert('Cleared', 'Local data removed.');
            } finally {
              setBusy(false);
            }
          },
        },
      ]
    );
  }

  const version = Constants.expoConfig?.version ?? '1.0.0';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: theme.spacing.md, paddingBottom: 48 }}>
        <AppText variant="title">Settings</AppText>

        <Card style={{ marginTop: theme.spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <AppText variant="subtitle">Notifications</AppText>
              <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }}>
                Local reminders for saved shows (MVP). Remote push can extend this layer later.
              </AppText>
            </View>
            <Switch
              accessibilityLabel="Enable notifications"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <PrimaryButton title="Request system permission" variant="ghost" onPress={() => void onRequestNotif()} />
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Default reminder</AppText>
          <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }}>
            Used when saving a new performance
          </AppText>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {([15, 30, 60] as ReminderDefault[]).map((m) => (
              <Pressable
                key={m}
                accessibilityRole="radio"
                accessibilityState={{ selected: reminderDefault === m }}
                onPress={() => setReminderDefault(m)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: reminderDefault === m ? theme.colors.tint : theme.colors.border,
                  backgroundColor: theme.colors.surface,
                  minWidth: 56,
                  alignItems: 'center',
                }}>
                <AppText variant="subtitle">{m}m</AppText>
              </Pressable>
            ))}
          </View>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <AppText variant="subtitle" style={{ flex: 1 }}>
              High contrast
            </AppText>
            <Switch
              accessibilityLabel="High contrast mode"
              value={highContrast}
              onValueChange={setHighContrast}
            />
          </View>
        </Card>

        <Card style={{ marginTop: theme.spacing.md }}>
          <AppText variant="subtitle">Text size</AppText>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {(['default', 'large', 'extraLarge'] as TextScaleOption[]).map((opt) => (
              <Pressable
                key={opt}
                accessibilityRole="radio"
                accessibilityState={{ selected: textScale === opt }}
                onPress={() => setTextScale(opt)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  borderRadius: 8,
                  borderWidth: 2,
                  borderColor: textScale === opt ? theme.colors.tint : theme.colors.border,
                }}>
                <AppText variant="caption" style={{ fontWeight: '700' }}>
                  {opt}
                </AppText>
              </Pressable>
            ))}
          </View>
        </Card>

        <PrimaryButton title="Clear local data" loading={busy} onPress={() => void onClear()} />

        <Card style={{ marginTop: theme.spacing.lg }}>
          <AppText variant="subtitle">About</AppText>
          <AppText variant="body" style={{ marginTop: 8 }}>
            Jazz Fest 2026 — unofficial fan utility prototype. Replace placeholder content before production.
          </AppText>
          <AppText variant="caption" style={{ marginTop: 12 }}>
            Version {version}
          </AppText>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
