import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '@/i18n';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useStore } from '@/store';

export const unstable_settings = {
  initialRouteName: 'login',
};

function useProtectedRoute() {
  const segments = useSegments();
  const router = useRouter();
  const token = useStore((state) => state.token);

  useEffect(() => {
    const inAuthGroup = segments[0] === '(tabs)';

    if (!token && inAuthGroup) {
      router.replace('/login');
    } else if (token && !inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [token, segments]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const loadPersistedData = useStore((state) => state.loadPersistedData);
  useProtectedRoute();

  useEffect(() => {
    loadPersistedData();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="delivery/[id]" options={{ title: 'Détails de la livraison', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
