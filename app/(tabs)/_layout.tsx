import { Tabs } from 'expo-router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';

function LogoTitle() {
  const theme = useTheme();
  return (
    <View style={styles.headerContainer}>
      <Image
        style={styles.headerLogo}
        source={require('@/assets/images/logo.png')}
        resizeMode="contain"
      />
      <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>
        Delivery<Text style={{ color: theme.colors.secondary }}>Pro</Text>
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.tabIconSelected,
        tabBarInactiveTintColor: theme.colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.background,
          height: 100,
          shadowColor: theme.colors.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 4,
        },
        headerTitle: (props) => <LogoTitle />,
        headerTitleAlign: 'center',
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        animation: 'shift',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.deliveries'),
          tabBarIcon: ({ color }) => <Icon size={24} name="package" color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('tabs.map'),
          tabBarIcon: ({ color }) => <Icon size={24} name="map" color={color} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: t('tabs.notifications'),
          tabBarIcon: ({ color }) => <Icon size={24} name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color }) => <Icon size={24} name="clock" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('tabs.profile'),
          tabBarIcon: ({ color }) => <Icon size={24} name="user" color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
