import AsyncStorage from '@react-native-async-storage/async-storage';
import { Commande } from '@/mock/types';

const STORAGE_KEYS = {
  ASSIGNED_DELIVERIES: '@deliveries:assigned',
  DELIVERY_PROOFS: '@deliveries:proofs',
} as const;

export const storageService = {
  /**
   * Sauvegarder les livraisons assignées au livreur
   */
  async saveAssignedDeliveries(deliveries: Commande[]): Promise<void> {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.ASSIGNED_DELIVERIES,
        JSON.stringify(deliveries)
      );
    } catch (error) {
      console.error('Error saving assigned deliveries:', error);
      throw error;
    }
  },

  /**
   * Récupérer les livraisons assignées
   */
  async getAssignedDeliveries(): Promise<Commande[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ASSIGNED_DELIVERIES);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading assigned deliveries:', error);
      return [];
    }
  },

  /**
   * Sauvegarder la preuve photo d'une livraison
   */
  async saveDeliveryProof(commandeId: number, photoUri: string): Promise<void> {
    try {
      const proofs = await this.getAllProofs();
      proofs[commandeId] = photoUri;
      await AsyncStorage.setItem(
        STORAGE_KEYS.DELIVERY_PROOFS,
        JSON.stringify(proofs)
      );
    } catch (error) {
      console.error('Error saving delivery proof:', error);
      throw error;
    }
  },

  /**
   * Récupérer la preuve photo d'une livraison
   */
  async getDeliveryProof(commandeId: number): Promise<string | null> {
    try {
      const proofs = await this.getAllProofs();
      return proofs[commandeId] || null;
    } catch (error) {
      console.error('Error loading delivery proof:', error);
      return null;
    }
  },

  /**
   * Récupérer toutes les preuves
   */
  async getAllProofs(): Promise<Record<number, string>> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DELIVERY_PROOFS);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error loading proofs:', error);
      return {};
    }
  },

  /**
   * Mettre à jour une livraison assignée
   */
  async updateAssignedDelivery(commande: Commande): Promise<void> {
    try {
      const deliveries = await this.getAssignedDeliveries();
      const index = deliveries.findIndex((d) => d.id === commande.id);

      if (index !== -1) {
        deliveries[index] = commande;
      } else {
        deliveries.push(commande);
      }

      await this.saveAssignedDeliveries(deliveries);
    } catch (error) {
      console.error('Error updating assigned delivery:', error);
      throw error;
    }
  },

  /**
   * Supprimer une livraison assignée (une fois complétée)
   */
  async removeAssignedDelivery(commandeId: number): Promise<void> {
    try {
      const deliveries = await this.getAssignedDeliveries();
      const filtered = deliveries.filter((d) => d.id !== commandeId);
      await this.saveAssignedDeliveries(filtered);
    } catch (error) {
      console.error('Error removing assigned delivery:', error);
      throw error;
    }
  },

  /**
   * Nettoyer toutes les données (pour déconnexion)
   */
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.ASSIGNED_DELIVERIES,
        STORAGE_KEYS.DELIVERY_PROOFS,
      ]);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw error;
    }
  },
};

export default storageService;
