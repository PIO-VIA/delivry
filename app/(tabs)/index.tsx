import { ScreenContainer } from '@/components/screen-container';
import { SwipeableTabWrapper } from '@/components/swipeable-tab-wrapper';
import { useResponsiveLayout } from '@/hooks/use-responsive-layout';
import { useTheme } from '@/hooks/use-theme';
import { Commande } from '@/lib/types';
import { useStore } from '@/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function DeliveriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { assignedDeliveries, fetchAssignedDeliveries, isLoading } = useStore();
  const { isLandscape } = useResponsiveLayout();

  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'assignee' | 'en_route' | 'en_cours' | 'livre' | 'echec'>('all');

  const loadDeliveries = async () => {
    await fetchAssignedDeliveries();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const getFilteredDeliveries = () => {
    if (filter === 'all') {
      return assignedDeliveries;
    }
    return assignedDeliveries.filter(d => d.statut === filter);
  };

  const getStatusColor = (status: Commande['statut']) => {
    switch (status) {
      case 'disponible':
        return theme.colors.info;
      case 'assignee':
        return theme.colors.warning;
      case 'en_attente':
        return theme.colors.warning;
      case 'en_route':
        return theme.colors.info;
      case 'en_cours':
        return theme.colors.primary;
      case 'livre':
        return theme.colors.success;
      case 'echec':
        return theme.colors.error;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getStatusText = (status: Commande['statut']) => {
    switch (status) {
      case 'disponible':
        return t('deliveries.statusAvailable');
      case 'assignee':
        return t('deliveries.statusAssigned');
      case 'en_attente':
        return t('deliveries.statusPending');
      case 'en_route':
        return t('deliveries.statusInRoute');
      case 'en_cours':
        return t('deliveries.statusInProgress');
      case 'livre':
        return t('deliveries.statusDelivered');
      case 'echec':
        return t('deliveries.statusFailed');
    }
  };

  const renderDeliveryItem = ({ item }: { item: Commande }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
      onPress={() => router.push(`/delivery/${item.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
          {item.numero_commande}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.statut) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.statut) }]}>
            {getStatusText(item.statut)}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={[styles.customerName, { color: theme.colors.text }]}>
          {item.client_nom}
        </Text>
        <Text style={[styles.address, { color: theme.colors.textSecondary }]} numberOfLines={2}>
          {item.adresse_livraison}
        </Text>
        <View style={styles.footer}>
          <Text style={[styles.amount, { color: theme.colors.primary }]}>
            {item.montant_total.toLocaleString()} FCFA
          </Text>
          <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
            {new Date(item.date_livraison_prevue).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <ScreenContainer>
        <SwipeableTabWrapper>
          <View style={styles.center}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        </SwipeableTabWrapper>
      </ScreenContainer>
    );
  }

  const filteredDeliveries = getFilteredDeliveries();

  return (
    <ScreenContainer edges={['bottom']}>
      <SwipeableTabWrapper>
        <View style={[styles.filterContainer, isLandscape && styles.filterContainerLandscape]}>
          {(['all', 'assignee', 'en_route', 'en_cours', 'livre', 'echec'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              style={[
                styles.filterButton,
                { borderColor: theme.colors.border },
                filter === f && { backgroundColor: theme.colors.primary },
              ]}
              onPress={() => setFilter(f)}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: filter === f ? '#FFFFFF' : theme.colors.text },
                ]}
              >
                {f === 'all' ? t('deliveries.myDeliveries') : getStatusText(f as Commande['statut'])}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredDeliveries}
          renderItem={renderDeliveryItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[
            styles.listContent,
            isLandscape && styles.listContentLandscape,
          ]}
          numColumns={isLandscape ? 2 : 1}
          key={isLandscape ? 'landscape' : 'portrait'}
          columnWrapperStyle={isLandscape ? styles.columnWrapper : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                {t('deliveries.noDeliveries')}
              </Text>
            </View>
          }
        />
      </SwipeableTabWrapper>
    </ScreenContainer>
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 10,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 0, // Remove border for cleaner look with shadow
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  cardBody: {
    gap: 8,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
  },
  address: {
    fontSize: 15,
    lineHeight: 20,
    opacity: 0.8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '500',
  },
  filterContainerLandscape: {
    paddingHorizontal: 24,
  },
  listContentLandscape: {
    paddingHorizontal: 24,
  },
  columnWrapper: {
    gap: 16,
  },
});
