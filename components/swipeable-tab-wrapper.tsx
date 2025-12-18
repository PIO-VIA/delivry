import { useRouter, useSegments } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

interface SwipeableTabWrapperProps {
  children: React.ReactNode;
}

const TAB_ROUTES = ['index', 'map', 'notifications', 'history', 'profile'];

export function SwipeableTabWrapper({ children }: SwipeableTabWrapperProps) {
  const router = useRouter();
  const segments = useSegments();
  const currentTabIndex = useSharedValue(0);

  const getTabIndexFromSegments = () => {
    const currentTab = segments[segments.length - 1];
    const index = TAB_ROUTES.indexOf(currentTab as string);
    // If we are on the root of tabs, it might be 'index' implicitly or segments ends with (tabs)
    // Adjust logic if needed, but defaulting to 0 ('index') for (tabs) is safe for now
    return index !== -1 ? index : 0;
  };

  useEffect(() => {
    currentTabIndex.value = getTabIndexFromSegments();
  }, [segments]);

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < TAB_ROUTES.length) {
      const route = TAB_ROUTES[index];
      const path = route === 'index' ? '/(tabs)' : `/(tabs)/${route}`;
      try {
        router.push(path as any);
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // Increased threshold to avoid accidental swipes during vertical scroll
    .failOffsetY([-20, 20])   // Increased vertical tolerance slightly
    .onEnd((event) => {
      'worklet';
      const SWIPE_THRESHOLD = 50;
      const SWIPE_VELOCITY_THRESHOLD = 300;

      const isHorizontalSwipe = Math.abs(event.velocityX) > Math.abs(event.velocityY);

      if (!isHorizontalSwipe) return;

      const currentIndex = currentTabIndex.value;

      if (
        (event.translationX > SWIPE_THRESHOLD || event.velocityX > SWIPE_VELOCITY_THRESHOLD) &&
        event.velocityX > 0
      ) {
        runOnJS(navigateToTab)(currentIndex - 1);
      } else if (
        (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -SWIPE_VELOCITY_THRESHOLD) &&
        event.velocityX < 0
      ) {
        runOnJS(navigateToTab)(currentIndex + 1);
      }
    });

  return (
    <GestureDetector gesture={panGesture}>
      <View style={styles.container}>{children}</View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
