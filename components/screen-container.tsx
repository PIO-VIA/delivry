import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/use-theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  style?: ViewStyle;
  withoutSafeArea?: boolean;
}

export function ScreenContainer({
  children,
  edges = ['top', 'bottom'],
  style,
  withoutSafeArea = false,
}: ScreenContainerProps) {
  const theme = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: theme.colors.background },
    style,
  ];

  if (withoutSafeArea) {
    return <View style={containerStyle}>{children}</View>;
  }

  return (
    <SafeAreaView edges={edges} style={containerStyle}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
