import { Icon } from '@/components/ui/icon';
import { useTheme } from '@/hooks/use-theme';
import { Commande, StatutCommande } from '@/mock/types';
import { useStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const { livreur, commandes, assignDelivery, updateDeliveryStatus, addDeliveryProof, deliveryProofs } = useStore();

  const [delivery, setDelivery] = useState<Commande | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundDelivery = commandes.find((c) => c.id === Number(id));
    setDelivery(foundDelivery || null);
  }, [id, commandes]);

  if (!delivery) {
    return (
      <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {t('deliveries.notFound')}
        </Text>
      </View>
    );
  }

  const canAssign = delivery.statut === 'disponible' && !delivery.livreur_id;
  const canStartRoute = delivery.statut === 'assignee' && delivery.livreur_id === livreur?.id;
  const canStartDelivery = delivery.statut === 'en_route' && delivery.livreur_id === livreur?.id;
  const canComplete = delivery.statut === 'en_cours' && delivery.livreur_id === livreur?.id;
  const canMarkFailed = (delivery.statut === 'en_route' || delivery.statut === 'en_cours') && delivery.livreur_id === livreur?.id;

  const handleAssign = async () => {
    if (!livreur) return;

    Alert.alert(
      t('deliveries.confirmAssign'),
      t('deliveries.confirmAssignMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: async () => {
            setIsProcessing(true);
            try {
              await assignDelivery(delivery);
              Alert.alert(t('common.success'), t('deliveries.assignSuccess'));
            } catch (error) {
              Alert.alert(t('common.error'), t('deliveries.assignError'));
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  const handleStatusChange = async (newStatus: StatutCommande) => {
    setIsProcessing(true);
    try {
      await updateDeliveryStatus(delivery.id, newStatus);
      Alert.alert(t('common.success'), t('deliveries.statusUpdateSuccess'));
    } catch (error: any) {
      Alert.alert(t('common.error'), error.message || t('deliveries.statusUpdateError'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddPhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(t('common.error'), t('deliveries.cameraPermissionDenied'));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setIsProcessing(true);
      try {
        await addDeliveryProof(delivery.id, result.assets[0].uri);
        Alert.alert(t('common.success'), t('deliveries.photoAdded'));
      } catch (error) {
        Alert.alert(t('common.error'), t('deliveries.photoError'));
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleComplete = async () => {
    const photoUri = deliveryProofs[delivery.id];

    if (!photoUri) {
      Alert.alert(
        t('deliveries.photoRequired'),
        t('deliveries.photoRequiredMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: t('deliveries.addPhoto'),
            onPress: handleAddPhoto,
          },
        ]
      );
      return;
    }

    Alert.alert(
      t('deliveries.confirmComplete'),
      t('deliveries.confirmCompleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.confirm'),
          onPress: () => handleStatusChange('livre'),
        },
      ]
    );
  };

  const getStatusColor = (statut: StatutCommande) => {
    switch (statut) {
      case 'disponible':
        return theme.colors.info;
      case 'assignee':
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

  const getStatusLabel = (statut: StatutCommande) => {
    switch (statut) {
      case 'disponible':
        return t('deliveries.statusAvailable');
      case 'assignee':
        return t('deliveries.statusAssigned');
      case 'en_route':
        return t('deliveries.statusInRoute');
      case 'en_cours':
        return t('deliveries.statusInProgress');
      case 'livre':
        return t('deliveries.statusDelivered');
      case 'echec':
        return t('deliveries.statusFailed');
      default:
        return statut;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const photoUri = deliveryProofs[delivery.id];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Map Section */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: delivery.latitude,
              longitude: delivery.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
              coordinate={{
                latitude: delivery.latitude,
                longitude: delivery.longitude,
              }}
              title={delivery.client_nom}
              description={delivery.adresse_livraison}
            />
          </MapView>

          {/* Floating Status Badge */}
          <View style={[styles.floatingStatus, { backgroundColor: getStatusColor(delivery.statut) }]}>
            <Text style={styles.floatingStatusText}>
              {getStatusLabel(delivery.statut)}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          {/* Header Info */}
          <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
            <View style={styles.headerTop}>
              <View>
                <Text style={[styles.orderLabel, { color: theme.colors.textSecondary }]}>
                  {t('deliveries.orderNumber')}
                </Text>
                <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
                  {delivery.numero_commande}
                </Text>
              </View>
              <View style={styles.priceTag}>
                <Text style={[styles.priceText, { color: theme.colors.success }]}>
                  {delivery.montant_total.toLocaleString()} FCFA
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.customerRow}>
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary + '20' }]}>
                <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                  {delivery.client_nom.charAt(0)}
                </Text>
              </View>
              <View>
                <Text style={[styles.customerName, { color: theme.colors.text }]}>
                  {delivery.client_nom}
                </Text>
                <Text style={[styles.customerPhone, { color: theme.colors.textSecondary }]}>
                  {delivery.client_phone}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.phoneButton, { backgroundColor: theme.colors.success + '20' }]}
                onPress={() => Alert.alert('Info', 'Appel simulé')}
              >
                <Icon name="phone" size={20} color={theme.colors.success} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Delivery Details */}
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('deliveries.deliveryInfo')}
          </Text>

          <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '10' }]}>
                <Icon name="map-pin" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  {t('deliveries.address')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {delivery.adresse_livraison}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { marginVertical: 16 }]} />

            <View style={styles.infoRow}>
              <View style={[styles.iconBox, { backgroundColor: theme.colors.warning + '10' }]}>
                <Icon name="clock" size={24} color={theme.colors.warning} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                  {t('deliveries.expectedDelivery')}
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  {formatDate(delivery.date_livraison_prevue)}
                </Text>
              </View>
            </View>
          </View>

          {/* Photo Proof Section */}
          {(canComplete || photoUri || delivery.preuve_photo_url) && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                {t('deliveries.photoProof')}
              </Text>
              <View style={[styles.card, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow, padding: 0, overflow: 'hidden' }]}>
                {photoUri || delivery.preuve_photo_url ? (
                  <Image
                    source={{ uri: photoUri || delivery.preuve_photo_url! }}
                    style={styles.proofImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.noPhoto}>
                    <Icon name="alert-circle" size={48} color={theme.colors.warning} />
                    <Text style={[styles.noPhotoText, { color: theme.colors.textSecondary }]}>
                      {t('deliveries.noPhoto')}
                    </Text>
                  </View>
                )}

                {canComplete && !photoUri && (
                  <TouchableOpacity
                    style={[styles.photoButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleAddPhoto}
                    disabled={isProcessing}
                  >
                    <Icon name="package" size={20} color="#FFFFFF" />
                    <Text style={styles.photoButtonText}>{t('deliveries.takePhoto')}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border }]}>
        {canAssign && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAssign}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="package" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>{t('deliveries.takeCharge')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {canStartRoute && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.info }]}
            onPress={() => handleStatusChange('en_route')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="navigation" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>{t('deliveries.startRoute')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {canStartDelivery && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => handleStatusChange('en_cours')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>{t('deliveries.startDelivery')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {canComplete && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.success }]}
            onPress={handleComplete}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="check-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>{t('deliveries.completeDelivery')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {canMarkFailed && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.colors.error }]}
            onPress={() => handleStatusChange('echec')}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Icon name="alert-circle" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonText}>{t('deliveries.markFailed')}</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
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
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  mapContainer: {
    height: 300,
    width: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  floatingStatus: {
    position: 'absolute',
    top: 40,
    right: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingStatusText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textTransform: 'uppercase',
  },
  content: {
    padding: 20,
    marginTop: -20, // Overlap map slightly
  },
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: '800',
  },
  priceTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    fontWeight: '700',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
  },
  phoneButton: {
    marginLeft: 'auto',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  proofImage: {
    width: '100%',
    height: 250,
  },
  noPhoto: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  noPhotoText: {
    fontSize: 14,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
