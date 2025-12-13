import { useColorScheme as useNativeColorScheme } from 'react-native';
import { useStore } from '@/store';
import { lightTheme, darkTheme, Theme } from '@/theme';

export const useTheme = (): Theme => {
  const nativeColorScheme = useNativeColorScheme();
  const themeMode = useStore((state) => state.theme);

  const effectiveTheme = themeMode === 'auto' ? nativeColorScheme : themeMode;

  return effectiveTheme === 'dark' ? darkTheme : lightTheme;
};
