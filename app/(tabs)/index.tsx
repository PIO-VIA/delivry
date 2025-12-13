import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import mockApi from '@/api/mockService';
import { Commande } from '@/mock/types';

export default function DeliveriesScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { livreur, setCommandes } = useStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deliveries, setDeliveries] = useState<Commande[]>([]);
  const [filter, setFilter] = useState<'all' | 'en_attente' | 'en_route' | 'en_cours'>('all');

  const loadDeliveries = async () => {
    if (!livreur) return;

    try {
      const data = await mockApi.getMyDeliveries(livreur.id);
      setDeliveries(data);
      setCommandes(data);
    } catch (error) {
      console.error('Error loading deliveries:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, [livreur]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadDeliveries();
  };

  const getFilteredDeliveries = () => {
    if (filter === 'all') {
      return deliveries.filter(d => ['en_attente', 'en_route', 'en_cours'].includes(d.statut));
    }
    return deliveries.filter(d => d.statut === filter);
  };

  const getStatusColor = (status: Commande['statut']) => {
    switch (status) {
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
    <View
      style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
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
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const filteredDeliveries = getFilteredDeliveries();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.filterContainer}>
        {(['all', 'en_attente', 'en_route', 'en_cours'] as const).map((f) => (
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
              {f === 'all' ? t('deliveries.myDeliveries') : getStatusText(f)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredDeliveries}
        renderItem={renderDeliveryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    gap: 6,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  address: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
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
