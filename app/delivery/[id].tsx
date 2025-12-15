import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/store';
import { Commande, StatutCommande } from '@/mock/types';
import { Icon } from '@/components/ui/icon';

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
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <View style={styles.headerTop}>
            <Text style={[styles.orderNumber, { color: theme.colors.text }]}>
              {delivery.numero_commande}
            </Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(delivery.statut) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(delivery.statut) }]}>
                {getStatusLabel(delivery.statut)}
              </Text>
            </View>
          </View>
          <Text style={[styles.customerName, { color: theme.colors.text }]}>
            {delivery.client_nom}
          </Text>
        </View>

        {/* Delivery Info */}
        <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('deliveries.deliveryInfo')}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="map-pin" size={20} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                {t('deliveries.address')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {delivery.adresse_livraison}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="phone" size={20} color={theme.colors.primary} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                {t('deliveries.phone')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                {delivery.client_phone}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="dollar" size={20} color={theme.colors.success} />
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: theme.colors.textSecondary }]}>
                {t('deliveries.amount')}
              </Text>
              <Text style={[styles.infoValue, { color: theme.colors.success, fontWeight: '600' }]}>
                {delivery.montant_total.toLocaleString()} FCFA
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Icon name="clock" size={20} color={theme.colors.warning} />
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
          <View style={[styles.section, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              {t('deliveries.photoProof')}
            </Text>

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
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          {canAssign && (
            <TouchableOpacity
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.colors.info }]}
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
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.colors.primary }]}
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
              style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.colors.success }]}
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
              style={[styles.actionButton, styles.dangerButton, { backgroundColor: theme.colors.error }]}
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
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    lineHeight: 20,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  noPhoto: {
    alignItems: 'center',
    paddingVertical: 32,
    gap: 12,
  },
  noPhotoText: {
    fontSize: 14,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  photoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 10,
  },
  primaryButton: {
    // backgroundColor set via theme
  },
  dangerButton: {
    // backgroundColor set via theme
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
