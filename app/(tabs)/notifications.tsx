import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import mockApi from '@/api/mockService';
import { Notification } from '@/mock/types';

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { livreur, setNotifications } = useStore();

  const [loading, setLoading] = useState(true);
  const [notifications, setLocalNotifications] = useState<Notification[]>([]);

  const loadNotifications = async () => {
    if (!livreur) return;

    try {
      const data = await mockApi.getMyNotifications(livreur.id);
      setLocalNotifications(data);
      setNotifications(data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [livreur]);

  const getTypeIcon = (type: Notification['type']) => {
    switch (type) {
      case 'nouvelle_livraison':
        return '📦';
      case 'changement_statut':
        return '✅';
      case 'rappel':
        return '⏰';
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
          <Text style={styles.iconText}>{getTypeIcon(item.type)}</Text>
        </View>
        <View style={styles.notifContent}>
          <Text style={[styles.notifMessage, { color: theme.colors.text }]} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={[styles.notifDate, { color: theme.colors.textSecondary }]}>
            {formatDate(item.date)}
          </Text>
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
  },
  notifCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  notifHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 24,
  },
  notifContent: {
    flex: 1,
    gap: 4,
  },
  notifMessage: {
    fontSize: 15,
    lineHeight: 20,
  },
  notifDate: {
    fontSize: 13,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 16,
  },
});
