import React, { useCallback } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';

import { FESTIVAL_MAP_ASPECT_HEIGHT_OVER_WIDTH } from '@/data/seed/mapImageAsset';
import { useAppTheme } from '@/theme/ThemeContext';

import { AppText } from '../common/AppText';

const MAP_ASSET = require('@/assets/images/jazz-fest-accessibility-map.png');

const { width: SCREEN_W } = Dimensions.get('window');

export function FestivalMapView() {
  const { theme } = useAppTheme();
  const mapW = SCREEN_W - 32;
  const mapH = mapW * FESTIVAL_MAP_ASPECT_HEIGHT_OVER_WIDTH;

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startTx = useSharedValue(0);
  const startTy = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      const next = savedScale.value * e.scale;
      scale.value = Math.min(4, Math.max(1, next));
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      tx.value = startTx.value + e.translationX;
      ty.value = startTy.value + e.translationY;
    })
    .onEnd(() => {
      startTx.value = tx.value;
      startTy.value = ty.value;
    });

  const composed = Gesture.Simultaneous(pinch, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  const resetZoom = useCallback(() => {
    scale.value = withTiming(1);
    savedScale.value = 1;
    tx.value = withTiming(0);
    ty.value = withTiming(0);
    startTx.value = 0;
    startTy.value = 0;
  }, [scale, savedScale, tx, ty, startTx, startTy]);

  return (
    <View style={{ flex: 1 }}>
      <AppText variant="caption" style={{ marginBottom: 8, color: theme.colors.textSecondary }}>
        Jazz Fest map for people with disabilities · Pinch to zoom · Drag to pan
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Reset map zoom"
        onPress={resetZoom}
        style={{
          alignSelf: 'flex-start',
          marginBottom: 8,
          paddingHorizontal: 12,
          paddingVertical: 8,
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radii.md,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}>
        <AppText variant="caption" style={{ fontWeight: '700' }}>
          Reset view
        </AppText>
      </Pressable>
      <ScrollView horizontal nestedScrollEnabled bounces={false} showsHorizontalScrollIndicator={false}>
        <ScrollView nestedScrollEnabled bounces={false} showsVerticalScrollIndicator={false}>
          <GestureDetector gesture={composed}>
            <Animated.View style={[{ width: mapW, height: mapH }, animatedStyle]}>
              <Image
                source={MAP_ASSET}
                style={[StyleSheet.absoluteFill, { width: mapW, height: mapH }]}
                contentFit="fill"
                accessibilityLabel="Jazz Fest map for people with disabilities"
              />
            </Animated.View>
          </GestureDetector>
        </ScrollView>
      </ScrollView>
    </View>
  );
}
