import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Notification } from '@/lib/types';
import { useStore } from '@/store';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { notifications } = useStore();

  const [loading, setLoading] = useState(false);

  // Notifications are loaded in the store or via push notifications
  // For now we just display what's in the store

  useEffect(() => {
    // Optional: fetch notifications from API if needed
  }, []);

  const getTypeIcon = (type: Notification['type']): 'package' | 'check-circle' | 'bell' => {
    switch (type) {
      case 'nouvelle_livraison':
        return 'package';
      case 'changement_statut':
        return 'check-circle';
      case 'rappel':
        return 'bell';
    }
  };

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'nouvelle_livraison':
        return theme.colors.primary;
      case 'changement_statut':
        return theme.colors.success;
      case 'rappel':
        return theme.colors.warning;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${hours}h`;
    } else {
      return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View
      style={[
        styles.notifCard,
        { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        !item.lu && { borderLeftColor: theme.colors.primary, borderLeftWidth: 4 },
      ]}
    >
      <View style={styles.notifHeader}>
        <View style={[styles.iconBadge, { backgroundColor: getTypeColor(item.type) + '20' }]}>
          <Icon name={getTypeIcon(item.type)} size={24} color={getTypeColor(item.type)} />
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifMessage, { color: theme.colors.text }]} numberOfLines={2}>
            {item.message}
          </Text>
          <View style={styles.notifFooter}>
            <Icon name="clock" size={12} color={theme.colors.textSecondary} />
            <Text style={[styles.notifDate, { color: theme.colors.textSecondary }]}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Icon name="bell" size={48} color={theme.colors.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('notifications.noNotifications')}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingTop: 20,
  },
  notifCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0,
    flexDirection: 'row',
  },
  notifHeader: {
    flexDirection: 'row',
    gap: 16,
    flex: 1,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifContent: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
  },
  notifMessage: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  notifFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  notifDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
    gap: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
