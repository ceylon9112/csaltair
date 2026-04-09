import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import type { Performance } from '@/types/models';

import { performanceToDate } from '@/utils/time';

/**
 * Local notifications for MVP + hooks for future remote push (FCM/APNs).
 * TODO(V2): Register device token, handle remote payloads in a single handler.
 */
export async function ensureAndroidChannelAsync(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Show reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#C4953A',
    });
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Festival alerts',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function requestPermissionsIfNeededAsync(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return false;
  }
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleShowReminderAsync(
  performance: Performance,
  artistName: string,
  offsetMinutes: number
): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }
  const start = performanceToDate(performance.date, performance.startTime);
  const fire = new Date(start.getTime() - offsetMinutes * 60 * 1000);
  if (fire.getTime() <= Date.now()) {
    return null;
  }
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Starting soon at Jazz Fest',
      body: `${artistName} · ${performance.stageName} · ${performance.startTime}`,
      data: { performanceId: performance.id, type: 'show_reminder' },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fire,
      ...(Platform.OS === 'android' ? { channelId: 'reminders' } : {}),
    },
  });
  return id;
}

export async function cancelScheduledNotificationAsync(id: string | null | undefined): Promise<void> {
  if (!id || Platform.OS === 'web') return;
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllScheduledRemindersAsync(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }
  const all = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    all
      .filter((n) => (n.content.data as { type?: string } | undefined)?.type === 'show_reminder')
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}
