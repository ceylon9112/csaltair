import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import {
  cancelScheduledNotificationAsync,
  scheduleShowReminderAsync,
} from '@/services/notifications/NotificationService';
import type { Performance, SavedPerformance } from '@/types/models';
import { contentRepository } from '@/services/content/ContentRepository';

import { persistStorage } from '@/store/persistStorage';

import { usePreferencesStore } from './preferencesStore';

type ScheduleState = {
  saved: Record<string, SavedPerformance>;
  /** Maps performanceId → expo notification identifier */
  notificationIds: Record<string, string>;
  savePerformance: (
    performance: Performance,
    reminderOffsetMinutes: number,
    artistName: string
  ) => Promise<void>;
  removePerformance: (performanceId: string) => Promise<void>;
  setReminder: (
    performanceId: string,
    reminderOffsetMinutes: number,
    artistName: string
  ) => Promise<void>;
  hydrateNotificationIds: (ids: Record<string, string>) => void;
};

async function maybeSchedule(
  perf: Performance,
  offset: number,
  artistName: string
): Promise<string | undefined> {
  const prefs = usePreferencesStore.getState();
  if (!prefs.notificationsEnabled) return undefined;
  const id = await scheduleShowReminderAsync(perf, artistName, offset);
  return id ?? undefined;
}

export const useScheduleStore = create<ScheduleState>()(
  persist(
    (set, get) => ({
      saved: {},
      notificationIds: {},
      hydrateNotificationIds: (notificationIds) => set({ notificationIds }),

      savePerformance: async (performance, reminderOffsetMinutes, artistName) => {
        const prev = get().notificationIds[performance.id];
        await cancelScheduledNotificationAsync(prev);

        const saved: SavedPerformance = {
          performanceId: performance.id,
          reminderOffsetMinutes,
          savedAt: new Date().toISOString(),
        };

        let notifId: string | undefined;
        try {
          notifId = await maybeSchedule(performance, reminderOffsetMinutes, artistName);
        } catch {
          notifId = undefined;
        }

        set((s) => ({
          saved: { ...s.saved, [performance.id]: saved },
          notificationIds: {
            ...s.notificationIds,
            ...(notifId ? { [performance.id]: notifId } : {}),
          },
        }));
      },

      removePerformance: async (performanceId) => {
        const prev = get().notificationIds[performanceId];
        await cancelScheduledNotificationAsync(prev);
        set((s) => {
          const { [performanceId]: _, ...rest } = s.saved;
          const { [performanceId]: __, ...nrest } = s.notificationIds;
          return { saved: rest, notificationIds: nrest };
        });
      },

      setReminder: async (performanceId, reminderOffsetMinutes, artistName) => {
        const bundle = contentRepository.getBundleSync();
        const perf = bundle.performances.find((p) => p.id === performanceId);
        if (!perf) return;
        const prev = get().notificationIds[performanceId];
        await cancelScheduledNotificationAsync(prev);

        let notifId: string | undefined;
        try {
          notifId = await maybeSchedule(perf, reminderOffsetMinutes, artistName);
        } catch {
          notifId = undefined;
        }

        set((s) => ({
          saved: {
            ...s.saved,
            [performanceId]: {
              ...s.saved[performanceId],
              reminderOffsetMinutes,
              savedAt: s.saved[performanceId]?.savedAt ?? new Date().toISOString(),
            },
          },
          notificationIds: {
            ...s.notificationIds,
            ...(notifId ? { [performanceId]: notifId } : {}),
          },
        }));
      },
    }),
    {
      name: 'jf26-schedule',
      storage: persistStorage,
      partialize: (s) => ({ saved: s.saved, notificationIds: s.notificationIds }),
    }
  )
);
