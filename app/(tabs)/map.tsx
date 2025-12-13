import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import * as Location from 'expo-location';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import { Commande } from '@/mock/types';
import { Icon } from '@/components/ui/icon';

export default function MapScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { livreur, commandes } = useStore();

  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg(t('map.permissionDenied'));
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg(t('map.locationError'));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeDeliveries = commandes.filter(
    (c) => c.statut === 'en_route' || c.statut === 'en_cours'
  );

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): string => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    if (distance < 1) {
      return `${Math.round(distance * 1000)} m`;
    }
    return `${distance.toFixed(1)} km`;
  };

  const openInMaps = (delivery: Commande) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.adresse_livraison)}`,
      android: `${scheme}${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.adresse_livraison)}`,
    });

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${delivery.latitude},${delivery.longitude}`);
        }
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (errorMsg || !location) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {errorMsg || t('common.error')}
        </Text>
        <Text style={[styles.hintText, { color: theme.colors.textSecondary }]}>
          {t('map.permissionHint')}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.locationCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        <View style={styles.locationHeader}>
          <Icon name="map-pin" size={20} color={theme.colors.primary} />
          <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>
            {t('map.currentLocation')}
          </Text>
        </View>
        {livreur && (
          <Text style={[styles.locationText, { color: theme.colors.text }]}>
            {livreur.adresse}
          </Text>
        )}
        <Text style={[styles.coordsText, { color: theme.colors.textSecondary }]}>
          {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('deliveries.inProgress')} ({activeDeliveries.length})
        </Text>

        {activeDeliveries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
              {t('deliveries.noDeliveries')}
            </Text>
          </View>
        ) : (
          activeDeliveries.map((delivery) => {
            const distance = calculateDistance(
              location.coords.latitude,
              location.coords.longitude,
              delivery.latitude,
              delivery.longitude
            );

            return (
              <TouchableOpacity
                key={delivery.id}
                style={[styles.deliveryCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => openInMaps(delivery)}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.headerLeft}>
                    <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
                      {delivery.numero_commande}
                    </Text>
                    <Text style={[styles.customerName, { color: theme.colors.textSecondary }]}>
                      {delivery.client_nom}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          delivery.statut === 'en_cours'
                            ? theme.colors.primary + '20'
                            : theme.colors.info + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color: delivery.statut === 'en_cours' ? theme.colors.primary : theme.colors.info,
                        },
                      ]}
                    >
                      {delivery.statut === 'en_cours' ? t('deliveries.statusInProgress') : t('deliveries.statusInRoute')}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.row}>
                    <Icon name="map-pin" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.address, { color: theme.colors.text }]} numberOfLines={2}>
                      {delivery.adresse_livraison}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Icon name="truck" size={16} color={theme.colors.primary} />
                    <Text style={[styles.distance, { color: theme.colors.primary }]}>
                      {distance}
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Icon name="dollar" size={16} color={theme.colors.success} />
                    <Text style={[styles.amount, { color: theme.colors.success }]}>
                      {delivery.montant_total.toLocaleString()} FCFA
                    </Text>
                  </View>

                  <View style={styles.row}>
                    <Icon name="phone" size={16} color={theme.colors.textSecondary} />
                    <Text style={[styles.phone, { color: theme.colors.textSecondary }]}>
                      {delivery.client_phone}
                    </Text>
                  </View>
                </View>

                <View style={[styles.navigateButton, { backgroundColor: theme.colors.primary }]}>
                  <Icon name="navigation" size={18} color="#FFFFFF" />
                  <Text style={styles.navigateText}>{t('map.navigate')}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
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
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  hintText: {
    fontSize: 14,
    textAlign: 'center',
  },
  locationCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  locationLabel: {
    fontSize: 14,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordsText: {
    fontSize: 12,
  },
  section: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deliveryCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
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
    gap: 10,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  address: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  distance: {
    fontSize: 14,
    fontWeight: '600',
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  phone: {
    fontSize: 14,
  },
  navigateButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  navigateText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 48,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
  },
});
