import { Link } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useAppTheme } from '@/theme/ThemeContext';

import { AppText } from '../common/AppText';

/**
 * Full-width tappable row: clearer than small 2-up tiles for “quick links”.
 */
export function QuickAction({
  href,
  icon,
  label,
  hint,
  description,
}: {
  href: string;
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  label: string;
  hint: string;
  /** Short subtitle explaining what opens (optional but recommended). */
  description?: string;
}) {
  const { theme } = useAppTheme();

  return (
    <Link href={href as '/lineup'} asChild>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        style={({ pressed }) => ({
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.spacing.md,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.lg,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
          opacity: pressed ? 0.92 : 1,
        })}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.background,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}>
          <FontAwesome name={icon} size={20} color={theme.colors.tint} accessibilityElementsHidden />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <AppText variant="subtitle" numberOfLines={2}>
            {label}
          </AppText>
          {description ? (
            <AppText variant="caption" style={{ marginTop: 4, color: theme.colors.textSecondary }} numberOfLines={3}>
              {description}
            </AppText>
          ) : null}
        </View>
        <FontAwesome name="chevron-right" size={14} color={theme.colors.textSecondary} accessibilityElementsHidden />
      </Pressable>
    </Link>
  );
}
