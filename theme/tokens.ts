import { Platform } from 'react-native';

/** Design tokens — warm NOLA-inspired palette, outdoor legibility. */
export const palette = {
  cream: '#FDF6E9',
  paper: '#FFF9F0',
  ink: '#1A1410',
  inkMuted: '#4A4038',
  brass: '#C4953A',
  brassDark: '#9A7328',
  terracotta: '#C45C3E',
  moss: '#2D5A4A',
  mossLight: '#3D7A62',
  sky: '#E8F4FC',
  line: '#E5D9C8',
  danger: '#B33A3A',
  success: '#2D6A4F',
  white: '#FFFFFF',
  overlay: 'rgba(26, 20, 16, 0.55)',
} as const;

export type TextScaleOption = 'default' | 'large' | 'extraLarge';

export const textScaleMultipliers: Record<TextScaleOption, number> = {
  default: 1,
  large: 1.12,
  extraLarge: 1.24,
};

export function scaledFont(
  base: number,
  scale: TextScaleOption,
  highContrast: boolean
): number {
  const m = textScaleMultipliers[scale];
  const bump = highContrast ? 1 : 0;
  return Math.round((base + bump) * m);
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  full: 9999,
} as const;

export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#1A1410',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: { elevation: 3 },
    default: {},
  }),
} as const;

export type ThemeMode = 'light' | 'highContrast';

export function getTheme(mode: ThemeMode) {
  const hc = mode === 'highContrast';
  return {
    mode,
    colors: {
      background: hc ? '#000000' : palette.paper,
      surface: hc ? '#1A1A1A' : palette.cream,
      text: hc ? '#FFFFFF' : palette.ink,
      textSecondary: hc ? '#E0E0E0' : palette.inkMuted,
      primary: hc ? '#FFD54F' : palette.brass,
      primaryText: hc ? '#000000' : palette.ink,
      accent: palette.terracotta,
      border: hc ? '#FFFFFF' : palette.line,
      tint: hc ? '#FFD54F' : palette.moss,
      tabIconDefault: hc ? '#888888' : palette.inkMuted,
      tabIconSelected: hc ? '#FFD54F' : palette.moss,
      danger: palette.danger,
      success: palette.success,
      bannerInfo: hc ? '#1E3A5F' : palette.sky,
      bannerWarn: hc ? '#5C3D00' : '#FFF3CD',
    },
    radii,
    spacing,
  };
}

export type AppTheme = ReturnType<typeof getTheme>;
