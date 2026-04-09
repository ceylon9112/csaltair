import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { UserReview } from '@/types/models';
import { persistStorage } from '@/store/persistStorage';

type ReviewState = {
  reviews: Record<string, UserReview>;
  upsertReview: (performanceId: string, rating: number, note: string) => void;
  clearReview: (performanceId: string) => void;
  clearAll: () => void;
};

const MAX_NOTE = 100;

export const useReviewStore = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: {},
      upsertReview: (performanceId, rating, note) => {
        const trimmed = note.slice(0, MAX_NOTE);
        const r: UserReview = {
          performanceId,
          rating: Math.min(5, Math.max(1, Math.round(rating))),
          note: trimmed,
          updatedAt: new Date().toISOString(),
        };
        set((s) => ({ reviews: { ...s.reviews, [performanceId]: r } }));
      },
      clearReview: (performanceId) =>
        set((s) => {
          const { [performanceId]: _, ...rest } = s.reviews;
          return { reviews: rest };
        }),
      clearAll: () => set({ reviews: {} }),
    }),
    { name: 'jf26-reviews', storage: persistStorage }
  )
);

export const REVIEW_NOTE_MAX = MAX_NOTE;
