import React from 'react';
import { View, type ViewProps } from 'react-native';

import { useAppTheme } from '@/theme/ThemeContext';

export function Card({ style, children, ...rest }: ViewProps) {
  const { theme } = useAppTheme();
  return (
    <View
      accessibilityRole="summary"
      style={[
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
          padding: theme.spacing.md,
        },
        style,
      ]}
      {...rest}>
      {children}
    </View>
  );
}
