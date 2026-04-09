import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { TextScaleOption } from '@/theme/tokens';
import { persistStorage } from '@/store/persistStorage';

export type ReminderDefault = 15 | 30 | 60;

interface PreferencesState {
  highContrast: boolean;
  textScale: TextScaleOption;
  reminderDefaultMinutes: ReminderDefault;
  notificationsEnabled: boolean;
  lastSyncedAt: string | null;
  setHighContrast: (v: boolean) => void;
  setTextScale: (v: TextScaleOption) => void;
  setReminderDefault: (v: ReminderDefault) => void;
  setNotificationsEnabled: (v: boolean) => void;
  touchSyncedNow: () => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      highContrast: false,
      textScale: 'default',
      reminderDefaultMinutes: 30,
      notificationsEnabled: true,
      lastSyncedAt: null,
      setHighContrast: (highContrast) => set({ highContrast }),
      setTextScale: (textScale) => set({ textScale }),
      setReminderDefault: (reminderDefaultMinutes) => set({ reminderDefaultMinutes }),
      setNotificationsEnabled: (notificationsEnabled) => set({ notificationsEnabled }),
      touchSyncedNow: () => set({ lastSyncedAt: new Date().toISOString() }),
    }),
    { name: 'jf26-preferences', storage: persistStorage }
  )
);
