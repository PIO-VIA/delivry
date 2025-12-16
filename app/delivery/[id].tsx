import { Icon } from '@/components/ui/icon';
import MapView, { Marker, PROVIDER_DEFAULT } from '@/components/ui/map';
import { useTheme } from '@/hooks/use-theme';
import { Commande, StatutCommande } from '@/lib/types';
import { useStore } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DeliveryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const theme = useTheme();
  const router = useRouter();
  const { livreur, assignedDeliveries, assignDelivery, updateDeliveryStatus, addDeliveryProof, deliveryProofs } = useStore();
  const [delivery, setDelivery] = useState<Commande | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const foundDelivery = assignedDeliveries.find((c) => c.id === Number(id));
    setDelivery(foundDelivery || null);
  }, [id, assignedDeliveries]);

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

  const openInMaps = () => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.adresse_livraison)}`,
      android: `${scheme}${delivery.latitude},${delivery.longitude}?q=${encodeURIComponent(delivery.adresse_livraison)}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const callCustomer = () => {
    Linking.openURL(`tel:${delivery.client_phone}`);
  };

  const getStatusColor = (statut: StatutCommande) => {
    switch (statut) {
      case 'disponible': return theme.colors.info;
      case 'assignee': return theme.colors.warning;
      case 'en_route': return theme.colors.info;
      case 'en_cours': return theme.colors.primary;
      case 'livre': return theme.colors.success;
      case 'echec': return theme.colors.error;
      default: return theme.colors.textSecondary;
    }
  };

  const getStatusLabel = (statut: StatutCommande) => {
    switch (statut) {
      case 'disponible': return t('deliveries.statusAvailable');
      case 'assignee': return t('deliveries.statusAssigned');
      case 'en_route': return t('deliveries.statusInRoute');
      case 'en_cours': return t('deliveries.statusInProgress');
      case 'livre': return t('deliveries.statusDelivered');
      case 'echec': return t('deliveries.statusFailed');
      default: return statut;
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
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Map Header */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_DEFAULT}
            initialRegion={{
              latitude: delivery.latitude,
              longitude: delivery.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: delivery.latitude,
                longitude: delivery.longitude,
              }}
            >
              <View style={[styles.markerContainer, { backgroundColor: theme.colors.primary }]}>
                <Icon name="map-pin" size={24} color="#FFFFFF" />
              </View>
            </Marker>
          </MapView>

          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: theme.colors.surface }]}
            onPress={() => router.back()}
          >
            <Icon name="chevron-right" size={24} color={theme.colors.text} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.expandMapButton, { backgroundColor: theme.colors.surface }]}
            onPress={openInMaps}
          >
            <Icon name="map" size={20} color={theme.colors.primary} />
            <Text style={[styles.expandMapText, { color: theme.colors.primary }]}>Ouvrir</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.contentContainer, { backgroundColor: theme.colors.background }]}>
          {/* Status Bar */}
          <View style={styles.statusBar}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(delivery.statut) }]}>
              <Icon name={delivery.statut === 'livre' ? 'check-circle' : 'package'} size={16} color="#FFFFFF" />
              <Text style={styles.statusText}>{getStatusLabel(delivery.statut)}</Text>
            </View>
            <Text style={[styles.orderId, { color: theme.colors.textSecondary }]}>#{delivery.numero_commande}</Text>
          </View>

          {/* Main Info Card */}
          <View style={[styles.mainCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
            <View style={styles.customerHeader}>
              <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '15' }]}>
                <Text style={[styles.avatarText, { color: theme.colors.primary }]}>{delivery.client_nom.charAt(0)}</Text>
              </View>
              <View style={styles.customerInfo}>
                <Text style={[styles.customerName, { color: theme.colors.text }]}>{delivery.client_nom}</Text>
                <Text style={[styles.customerPhone, { color: theme.colors.textSecondary }]}>{delivery.client_phone}</Text>
              </View>
              <TouchableOpacity
                style={[styles.callButton, { backgroundColor: theme.colors.success + '15' }]}
                onPress={callCustomer}
              >
                <Icon name="phone" size={24} color={theme.colors.success} />
              </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.locationRow}>
              <View style={[styles.locationIcon, { backgroundColor: theme.colors.surface }]}>
                <Icon name="map-pin" size={20} color={theme.colors.text} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>{t('deliveries.address')}</Text>
                <Text style={[styles.locationValue, { color: theme.colors.text }]}>{delivery.adresse_livraison}</Text>
              </View>
            </View>

            <View style={styles.timeRow}>
              <View style={[styles.locationIcon, { backgroundColor: theme.colors.surface }]}>
                <Icon name="clock" size={20} color={theme.colors.text} />
              </View>
              <View style={styles.locationInfo}>
                <Text style={[styles.locationLabel, { color: theme.colors.textSecondary }]}>{t('deliveries.expectedDelivery')}</Text>
                <Text style={[styles.locationValue, { color: theme.colors.text }]}>{formatDate(delivery.date_livraison_prevue)}</Text>
              </View>
            </View>
          </View>

          {/* Payment Card */}
          <View style={[styles.paymentCard, { backgroundColor: theme.colors.card, shadowColor: theme.colors.shadow }]}>
            <View style={styles.paymentRow}>
              <Text style={[styles.paymentLabel, { color: theme.colors.textSecondary }]}>Montant à encaisser</Text>
              <Text style={[styles.paymentValue, { color: theme.colors.success }]}>{delivery.montant_total.toLocaleString()} FCFA</Text>
            </View>
          </View>

          {/* Photo Proof Section */}
          {(canComplete || photoUri || delivery.preuve_photo_url) && (
            <View style={styles.proofSection}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{t('deliveries.photoProof')}</Text>
              <TouchableOpacity
                style={[styles.proofCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={canComplete ? handleAddPhoto : undefined}
                activeOpacity={canComplete ? 0.7 : 1}
              >
                {photoUri || delivery.preuve_photo_url ? (
                  <Image
                    source={{ uri: photoUri || delivery.preuve_photo_url! }}
                    style={styles.proofImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.uploadPlaceholder}>
                    <Icon name="camera" size={32} color={theme.colors.primary} />
                    <Text style={[styles.uploadText, { color: theme.colors.textSecondary }]}>
                      {t('deliveries.takePhoto')}
                    </Text>
                  </View>
                )}
                {canComplete && (photoUri || delivery.preuve_photo_url) && (
                  <View style={[styles.retakeButton, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
                    <Icon name="camera" size={20} color="#FFFFFF" />
                    <Text style={styles.retakeText}>Changer</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Bar */}
      <View style={[styles.actionBar, { backgroundColor: theme.colors.surface, shadowColor: theme.colors.shadow }]}>
        {canAssign && (
          <TouchableOpacity
            style={[styles.mainActionButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleAssign}
            disabled={isProcessing}
          >
            {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : (
              <>
                <Text style={styles.mainActionText}>{t('deliveries.takeCharge')}</Text>
                <Icon name="package" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}

        {canStartRoute && (
          <TouchableOpacity
            style={[styles.mainActionButton, { backgroundColor: theme.colors.info }]}
            onPress={() => handleStatusChange('en_route')}
            disabled={isProcessing}
          >
            {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : (
              <>
                <Text style={styles.mainActionText}>{t('deliveries.startRoute')}</Text>
                <Icon name="navigation" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        )}

        {canStartDelivery && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.secondaryActionButton, { backgroundColor: theme.colors.error + '15' }]}
              onPress={() => handleStatusChange('echec')}
              disabled={isProcessing}
            >
              <Icon name="alert-circle" size={24} color={theme.colors.error} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mainActionButton, { backgroundColor: theme.colors.primary, flex: 1 }]}
              onPress={() => handleStatusChange('en_cours')}
              disabled={isProcessing}
            >
              {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.mainActionText}>{t('deliveries.startDelivery')}</Text>
                  <Icon name="truck" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {canComplete && (
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.secondaryActionButton, { backgroundColor: theme.colors.error + '15' }]}
              onPress={() => handleStatusChange('echec')}
              disabled={isProcessing}
            >
              <Icon name="alert-circle" size={24} color={theme.colors.error} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.mainActionButton, { backgroundColor: theme.colors.success, flex: 1 }]}
              onPress={handleComplete}
              disabled={isProcessing}
            >
              {isProcessing ? <ActivityIndicator color="#FFFFFF" /> : (
                <>
                  <Text style={styles.mainActionText}>{t('deliveries.completeDelivery')}</Text>
                  <Icon name="check-circle" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>
          </View>
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
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    height: 350,
    width: '100%',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  expandMapButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  expandMapText: {
    fontWeight: '600',
    fontSize: 14,
  },
  contentContainer: {
    flex: 1,
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  customerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  customerPhone: {
    fontSize: 14,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
    opacity: 0.1,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 16,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 16,
  },
  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  paymentCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  proofSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginLeft: 4,
  },
  proofCard: {
    height: 200,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  proofImage: {
    width: '100%',
    height: '100%',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  retakeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  mainActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 20,
    gap: 12,
  },
  mainActionText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryActionButton: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
