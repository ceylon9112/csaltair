import { Platform } from 'react-native';

/**
 * Web: expo-notifications is not supported; skip to avoid startup failures.
 * Native: register handler + Android channels.
 */
export async function initNotificationsForCurrentPlatform(): Promise<void> {
  if (Platform.OS === 'web') {
    return;
  }

  const Notifications = await import('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  const { ensureAndroidChannelAsync } = await import('./NotificationService');
  await ensureAndroidChannelAsync();
}
