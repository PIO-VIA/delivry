import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import mockApi from '@/api/mockService';
import { HistoriqueLivraison } from '@/mock/types';
import { getCommandeById } from '@/mock';

export default function HistoryScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { livreur } = useStore();

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoriqueLivraison[]>([]);

  const loadHistory = async () => {
    if (!livreur) return;

    try {
      const data = await mockApi.getMyHistory(livreur.id);
      setHistory(data.sort((a, b) => new Date(b.date_livraison).getTime() - new Date(a.date_livraison).getTime()));
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [livreur]);

  const renderHistoryItem = ({ item }: { item: HistoriqueLivraison }) => {
    const commande = getCommandeById(item.commande_id);
    if (!commande) return null;

    return (
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
              {commande.numero_commande}
            </Text>
            <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
              {commande.client_nom}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  item.statut_final === 'livre'
                    ? theme.colors.success + '20'
                    : theme.colors.error + '20',
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color:
                    item.statut_final === 'livre' ? theme.colors.success : theme.colors.error,
                },
              ]}
            >
              {item.statut_final === 'livre' ? t('deliveries.statusDelivered') : t('deliveries.statusFailed')}
            </Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={[styles.address, { color: theme.colors.textSecondary }]} numberOfLines={1}>
            {commande.adresse_livraison}
          </Text>

          <View style={styles.footer}>
            <View style={styles.footerLeft}>
              <Text style={[styles.amount, { color: theme.colors.primary }]}>
                {commande.montant_total.toLocaleString()} FCFA
              </Text>
              <Text style={[styles.date, { color: theme.colors.textSecondary }]}>
                {new Date(item.date_livraison).toLocaleDateString('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </Text>
            </View>

            {item.preuve_photo_url && (
              <Image
                source={{ uri: item.preuve_photo_url }}
                style={styles.proofThumbnail}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

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
        data={history}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('history.noHistory')}
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
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 14,
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
    gap: 8,
  },
  address: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
    gap: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: '700',
  },
  date: {
    fontSize: 13,
  },
  proofThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
