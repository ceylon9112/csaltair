import React from 'react';
import { Pressable, type PressableProps, ActivityIndicator } from 'react-native';

import { useAppTheme } from '@/theme/ThemeContext';

import { AppText } from './AppText';

export function PrimaryButton({
  title,
  loading,
  variant = 'primary',
  ...rest
}: PressableProps & { title: string; loading?: boolean; variant?: 'primary' | 'ghost' }) {
  const { theme } = useAppTheme();
  const c = theme.colors;

  const bg = variant === 'primary' ? c.primary : 'transparent';
  const fg = variant === 'primary' ? c.primaryText : c.tint;
  const border = variant === 'ghost' ? c.border : 'transparent';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      style={({ pressed }) => [
        {
          backgroundColor: bg,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
          borderRadius: theme.radii.md,
          borderWidth: variant === 'ghost' ? 1 : 0,
          borderColor: border,
          opacity: pressed ? 0.88 : 1,
          minHeight: 48,
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
      {...rest}>
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <AppText variant="body" style={{ color: fg, fontWeight: '600' }}>
          {title}
        </AppText>
      )}
    </Pressable>
  );
}
