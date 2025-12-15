import { create } from 'zustand';
import { Livreur, Commande, Notification, StatutCommande } from '@/mock/types';
import { ThemeMode } from '@/theme';

// Import optionnel du storage service
let storageService: any = null;
try {
  storageService = require('@/services/storageService').default;
} catch (error) {
  console.warn('Storage service not available:', error);
}

interface AppState {
  livreur: Omit<Livreur, 'password'> | null;
  token: string | null;
  language: 'fr' | 'en';
  theme: ThemeMode;
  commandes: Commande[];
  notifications: Notification[];
  assignedDeliveries: Commande[];
  deliveryProofs: Record<number, string>;

  setLivreur: (livreur: Omit<Livreur, 'password'> | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (language: 'fr' | 'en') => void;
  setTheme: (theme: ThemeMode) => void;
  setCommandes: (commandes: Commande[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  updateCommande: (id: number, updates: Partial<Commande>) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;

  // Nouvelles actions V1.1
  assignDelivery: (commande: Commande) => Promise<void>;
  updateDeliveryStatus: (id: number, newStatus: StatutCommande) => Promise<void>;
  addDeliveryProof: (commandeId: number, photoUri: string) => Promise<void>;
  loadPersistedData: () => Promise<void>;
  completeDelivery: (id: number) => Promise<void>;

  logout: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  livreur: null,
  token: null,
  language: 'fr',
  theme: 'auto',
  commandes: [],
  notifications: [],
  assignedDeliveries: [],
  deliveryProofs: {},

  setLivreur: (livreur) => set({ livreur }),
  setToken: (token) => set({ token }),
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),
  setCommandes: (commandes) => set({ commandes }),
  setNotifications: (notifications) => set({ notifications }),

  updateCommande: (id, updates) =>
    set((state) => ({
      commandes: state.commandes.map((cmd) =>
        cmd.id === id ? { ...cmd, ...updates } : cmd
      ),
    })),

  markNotificationAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notif) =>
        notif.id === id ? { ...notif, lu: true } : notif
      ),
    })),

  markAllNotificationsAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notif) => ({ ...notif, lu: true })),
    })),

  // Assigner une livraison au livreur
  assignDelivery: async (commande) => {
    const state = get();
    if (!state.livreur) return;

    const updatedCommande: Commande = {
      ...commande,
      statut: 'assignee',
      livreur_id: state.livreur.id,
    };

    // Mettre à jour le state
    set((s) => ({
      assignedDeliveries: [...s.assignedDeliveries, updatedCommande],
      commandes: s.commandes.map((c) =>
        c.id === commande.id ? updatedCommande : c
      ),
    }));

    // Persister (optionnel)
    if (storageService) {
      try {
        await storageService.updateAssignedDelivery(updatedCommande);
      } catch (error) {
        console.warn('Failed to persist delivery:', error);
      }
    }
  },

  // Mettre à jour le statut d'une livraison
  updateDeliveryStatus: async (id, newStatus) => {
    set((state) => ({
      assignedDeliveries: state.assignedDeliveries.map((d) =>
        d.id === id ? { ...d, statut: newStatus } : d
      ),
      commandes: state.commandes.map((c) =>
        c.id === id ? { ...c, statut: newStatus } : c
      ),
    }));

    // Persister (optionnel)
    if (storageService) {
      try {
        const delivery = get().assignedDeliveries.find((d) => d.id === id);
        if (delivery) {
          await storageService.updateAssignedDelivery({
            ...delivery,
            statut: newStatus,
          });
        }
      } catch (error) {
        console.warn('Failed to persist status update:', error);
      }
    }
  },

  // Ajouter une preuve photo
  addDeliveryProof: async (commandeId, photoUri) => {
    set((state) => ({
      deliveryProofs: {
        ...state.deliveryProofs,
        [commandeId]: photoUri,
      },
      assignedDeliveries: state.assignedDeliveries.map((d) =>
        d.id === commandeId ? { ...d, preuve_photo_url: photoUri } : d
      ),
      commandes: state.commandes.map((c) =>
        c.id === commandeId ? { ...c, preuve_photo_url: photoUri } : c
      ),
    }));

    // Persister (optionnel)
    if (storageService) {
      try {
        await storageService.saveDeliveryProof(commandeId, photoUri);

        const delivery = get().assignedDeliveries.find((d) => d.id === commandeId);
        if (delivery) {
          await storageService.updateAssignedDelivery({
            ...delivery,
            preuve_photo_url: photoUri,
          });
        }
      } catch (error) {
        console.warn('Failed to persist photo proof:', error);
      }
    }
  },

  // Charger les données persistées
  loadPersistedData: async () => {
    if (!storageService) {
      console.log('Storage service not available, skipping data load');
      return;
    }

    try {
      const [assignedDeliveries, proofs] = await Promise.all([
        storageService.getAssignedDeliveries(),
        storageService.getAllProofs(),
      ]);

      set({
        assignedDeliveries,
        deliveryProofs: proofs,
      });
    } catch (error) {
      console.warn('Failed to load persisted data:', error);
    }
  },

  // Compléter une livraison (la retirer des assignées)
  completeDelivery: async (id) => {
    set((state) => ({
      assignedDeliveries: state.assignedDeliveries.filter((d) => d.id !== id),
    }));

    if (storageService) {
      try {
        await storageService.removeAssignedDelivery(id);
      } catch (error) {
        console.warn('Failed to remove completed delivery:', error);
      }
    }
  },

  logout: async () => {
    // Nettoyer le stockage (optionnel)
    if (storageService) {
      try {
        await storageService.clearAll();
      } catch (error) {
        console.warn('Failed to clear storage:', error);
      }
    }

    set({
      livreur: null,
      token: null,
      commandes: [],
      notifications: [],
      assignedDeliveries: [],
      deliveryProofs: {},
    });
  },
}));
