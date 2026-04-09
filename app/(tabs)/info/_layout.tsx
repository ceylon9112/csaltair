import { Stack } from 'expo-router';
import React from 'react';

import { useAppTheme } from '@/theme/ThemeContext';

export default function InfoStackLayout() {
  const { theme } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerTitleStyle: { fontWeight: '700' },
        headerBackTitle: 'Back',
      }}>
      <Stack.Screen name="index" options={{ title: 'Info' }} />
      <Stack.Screen name="accessibility" options={{ title: 'Accessibility' }} />
      <Stack.Screen name="tickets" options={{ title: 'Tickets' }} />
      <Stack.Screen name="festival" options={{ title: 'Festival info' }} />
      <Stack.Screen name="health" options={{ title: 'Health & safety' }} />
      <Stack.Screen name="parking" options={{ title: 'Parking & shuttle' }} />
      <Stack.Screen name="faq" options={{ title: 'FAQ' }} />
      <Stack.Screen name="alerts" options={{ title: 'Alerts' }} />
      <Stack.Screen name="reviews" options={{ title: 'My reviews' }} />
      <Stack.Screen name="settings" options={{ title: 'Settings' }} />
    </Stack>
  );
}
