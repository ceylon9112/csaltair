/**
 * Web/Vite build: no Expo notifications — satisfies shared scheduleStore imports.
 */
import type { Performance } from '@/types/models';

export async function ensureAndroidChannelAsync(): Promise<void> {}

export async function requestPermissionsIfNeededAsync(): Promise<boolean> {
  return false;
}

export async function scheduleShowReminderAsync(
  _performance: Performance,
  _artistName: string,
  _offsetMinutes: number
): Promise<string | null> {
  return null;
}

export async function cancelScheduledNotificationAsync(_id?: string): Promise<void> {}

export async function cancelAllScheduledRemindersAsync(): Promise<void> {}
