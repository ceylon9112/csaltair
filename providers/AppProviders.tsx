import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useState } from 'react';

import { ThemeProvider } from '@/theme/ThemeContext';
import { usePreferencesStore } from '@/store/preferencesStore';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const highContrast = usePreferencesStore((s) => s.highContrast);
  const textScale = usePreferencesStore((s) => s.textScale);

  return (
    <QueryClientProvider client={client}>
      <ThemeProvider highContrast={highContrast} textScale={textScale}>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
