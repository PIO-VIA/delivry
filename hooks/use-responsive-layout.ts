import { useWindowDimensions } from 'react-native';

export type Orientation = 'portrait' | 'landscape';

export interface ResponsiveLayout {
  width: number;
  height: number;
  orientation: Orientation;
  isLandscape: boolean;
  isPortrait: boolean;
  scale: number;
  fontScale: number;
}

export function useResponsiveLayout(): ResponsiveLayout {
  const { width, height, scale, fontScale } = useWindowDimensions();

  const orientation: Orientation = width > height ? 'landscape' : 'portrait';
  const isLandscape = orientation === 'landscape';
  const isPortrait = orientation === 'portrait';

  return {
    width,
    height,
    orientation,
    isLandscape,
    isPortrait,
    scale,
    fontScale,
  };
}

export function getResponsiveSpacing(
  baseSpacing: number,
  isLandscape: boolean
): number {
  return isLandscape ? baseSpacing * 0.7 : baseSpacing;
}

export function getResponsiveFontSize(
  baseFontSize: number,
  isLandscape: boolean
): number {
  return isLandscape ? baseFontSize * 0.9 : baseFontSize;
}

export function getResponsiveColumns(isLandscape: boolean): number {
  return isLandscape ? 2 : 1;
}
