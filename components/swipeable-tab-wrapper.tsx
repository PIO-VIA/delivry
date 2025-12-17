import { useRouter, useSegments } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

interface SwipeableTabWrapperProps {
  children: React.ReactNode;
}

const TAB_ROUTES = ['index', 'map', 'notifications', 'history', 'profile'];

export function SwipeableTabWrapper({ children }: SwipeableTabWrapperProps) {
  const router = useRouter();
  const segments = useSegments();

  const getCurrentTabIndex = (): number => {
    const currentTab = segments[segments.length - 1];
    const index = TAB_ROUTES.indexOf(currentTab as string);
    return index !== -1 ? index : 0;
  };

  const navigateToTab = (index: number) => {
    if (index >= 0 && index < TAB_ROUTES.length) {
      const route = TAB_ROUTES[index];
      const path = route === 'index' ? '/(tabs)' : `/(tabs)/${route}`;
      router.push(path as any);
    }
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onEnd((event) => {
      const SWIPE_THRESHOLD = 50;
      const SWIPE_VELOCITY_THRESHOLD = 300;

      const isHorizontalSwipe = Math.abs(event.velocityX) > Math.abs(event.velocityY);

      if (!isHorizontalSwipe) return;

      const currentIndex = getCurrentTabIndex();

      if (
        (event.translationX > SWIPE_THRESHOLD || event.velocityX > SWIPE_VELOCITY_THRESHOLD) &&
        event.velocityX > 0
      ) {
        navigateToTab(currentIndex - 1);
      } else if (
        (event.translationX < -SWIPE_THRESHOLD || event.velocityX < -SWIPE_VELOCITY_THRESHOLD) &&
        event.velocityX < 0
      ) {
        navigateToTab(currentIndex + 1);
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
