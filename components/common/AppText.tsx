import React from 'react';
import { Text, type TextProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeContext';
import { scaledFont } from '@/theme/tokens';

type Variant = 'title' | 'subtitle' | 'body' | 'caption' | 'label';

export function AppText({
  variant = 'body',
  style,
  children,
  maxFontSizeMultiplier = 1.6,
  ...rest
}: TextProps & { variant?: Variant }) {
  const { theme, textScale, highContrast } = useAppTheme();
  const c = theme.colors;

  const size =
    variant === 'title'
      ? scaledFont(22, textScale, highContrast)
      : variant === 'subtitle'
        ? scaledFont(17, textScale, highContrast)
        : variant === 'caption' || variant === 'label'
          ? scaledFont(13, textScale, highContrast)
          : scaledFont(16, textScale, highContrast);

  const weight =
    variant === 'title' || variant === 'subtitle'
      ? '600' as const
      : variant === 'label'
        ? '600' as const
        : '400' as const;

  const color =
    variant === 'caption' ? c.textSecondary : c.text;

  return (
    <Text
      accessibilityRole={variant === 'title' ? 'header' : undefined}
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      style={[
        {
          fontSize: size,
          fontWeight: weight,
          color,
          letterSpacing: variant === 'label' ? 0.5 : 0,
        },
        style,
      ]}
      {...rest}>
      {children}
    </Text>
  );
}
