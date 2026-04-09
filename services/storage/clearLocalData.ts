import { cancelAllScheduledRemindersAsync } from '@/services/notifications/NotificationService';
import { usePreferencesStore } from '@/store/preferencesStore';
import { useReviewStore } from '@/store/reviewStore';
import { useScheduleStore } from '@/store/scheduleStore';

/** Clears saved schedule, reviews, preferences, and cancels scheduled local notifications. */
export async function clearAllLocalDataAsync(): Promise<void> {
  await cancelAllScheduledRemindersAsync();
  await useScheduleStore.persist.clearStorage();
  await useReviewStore.persist.clearStorage();
  await usePreferencesStore.persist.clearStorage();
  useScheduleStore.setState({ saved: {}, notificationIds: {} });
  useReviewStore.setState({ reviews: {} });
  usePreferencesStore.setState({
    highContrast: false,
    textScale: 'default',
    reminderDefaultMinutes: 30,
    notificationsEnabled: true,
    lastSyncedAt: null,
  });
}
