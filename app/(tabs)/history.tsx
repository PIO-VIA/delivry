import mockApi from '@/api/mockService';
import { useTheme } from '@/hooks/use-theme';
import { getCommandeById } from '@/mock';
import { HistoriqueLivraison } from '@/mock/types';
import { useStore } from '@/store';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
      <TouchableOpacity
        style={[
          styles.card,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.border },
        ]}
        onPress={() => router.push(`/delivery/${item.commande_id}`)}
        activeOpacity={0.7}
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
      </TouchableOpacity>
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
    paddingTop: 20,
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
    borderWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
    gap: 4,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '500',
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
    gap: 12,
  },
  address: {
    fontSize: 15,
    lineHeight: 22,
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
  footerLeft: {
    flex: 1,
    gap: 4,
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
  },
  date: {
    fontSize: 14,
    fontWeight: '500',
  },
  proofThumbnail: {
    width: 64,
    height: 64,
    borderRadius: 12,
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
});
