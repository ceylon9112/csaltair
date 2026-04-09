import React, { createContext, useContext, useMemo } from 'react';

import { getTheme, TextScaleOption, type AppTheme, type ThemeMode } from './tokens';

interface ThemeCtx {
  theme: AppTheme;
  highContrast: boolean;
  textScale: TextScaleOption;
}

const Ctx = createContext<ThemeCtx | null>(null);

export function ThemeProvider({
  children,
  highContrast,
  textScale,
}: {
  children: React.ReactNode;
  highContrast: boolean;
  textScale: TextScaleOption;
}) {
  const mode: ThemeMode = highContrast ? 'highContrast' : 'light';
  const value = useMemo(
    () => ({
      theme: getTheme(mode),
      highContrast,
      textScale,
    }),
    [mode, highContrast, textScale]
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAppTheme() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAppTheme must be used within ThemeProvider');
  return v;
}
