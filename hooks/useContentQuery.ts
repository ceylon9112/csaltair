import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { contentRepository } from '@/services/content/ContentRepository';
import { usePreferencesStore } from '@/store/preferencesStore';

export const QUERY_CONTENT = ['jf26', 'content', 'bundle'] as const;

export function useContentBundle() {
  const touchSynced = usePreferencesStore((s) => s.touchSyncedNow);

  const q = useQuery({
    queryKey: QUERY_CONTENT,
    queryFn: () => contentRepository.getBundle(),
    staleTime: Infinity,
    gcTime: Infinity,
  });

  useEffect(() => {
    if (q.data) {
      touchSynced();
    }
  }, [q.data, touchSynced]);

  return q;
}
