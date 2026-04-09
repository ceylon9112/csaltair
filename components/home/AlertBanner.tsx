import { Link } from 'expo-router';
import React from 'react';
import { View, Pressable } from 'react-native';

import type { AlertItem } from '@/types/models';
import { useAppTheme } from '@/theme/ThemeContext';

import { AppText } from '../common/AppText';

export function AlertBanner({ alert }: { alert: AlertItem }) {
  const { theme } = useAppTheme();
  const bg =
    alert.severity === 'warning' ? theme.colors.bannerWarn : theme.colors.bannerInfo;

  const inner = (
    <View
      accessibilityRole="alert"
      style={{
        backgroundColor: bg,
        padding: theme.spacing.md,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}>
      <AppText variant="subtitle" style={{ marginBottom: 4 }}>
        {alert.title}
      </AppText>
      <AppText variant="body">{alert.body}</AppText>
      {alert.ctaLabel && alert.ctaRoute ? (
        <AppText variant="caption" style={{ marginTop: 8, fontWeight: '600' }}>
          {alert.ctaLabel} →
        </AppText>
      ) : null}
    </View>
  );

  if (alert.ctaRoute) {
    return (
      <Link href={alert.ctaRoute as '/info/accessibility'} asChild>
        <Pressable accessibilityRole="button">{inner}</Pressable>
      </Link>
    );
  }

  return inner;
}
