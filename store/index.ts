import { OpenAPI } from '@/lib';
import { configureApi, setApiToken } from '@/lib/api-config';
import { AuthService } from '@/lib/services/AuthService';
import { DeliveriesService } from '@/lib/services/DeliveriesService';
import { Commande, HistoriqueLivraison, Livreur, Notification, StatutCommande } from '@/lib/types';
import { ThemeMode } from '@/theme';
import { create } from 'zustand';

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
  history: HistoriqueLivraison[];
  assignedDeliveries: Commande[];
  deliveryProofs: Record<number, string>;
  isLoading: boolean;
  error: string | null;

  setLivreur: (livreur: Omit<Livreur, 'password'> | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (language: 'fr' | 'en') => void;
  setTheme: (theme: ThemeMode) => void;

  // Actions API
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchAssignedDeliveries: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  assignDelivery: (delivery: Commande) => Promise<void>;

  updateDeliveryStatus: (id: number, newStatus: StatutCommande) => Promise<void>;
  addDeliveryProof: (commandeId: number, photoUri: string) => Promise<void>;
  loadPersistedData: () => Promise<void>;

  // Legacy/Local actions (kept for compatibility if needed, but should be replaced)
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
}

// Helper to map API User to App Livreur
const mapUserToLivreur = (user: any): Omit<Livreur, 'password'> => ({
  id: user.id,
  username: user.name,
  email: user.email,
  role: 'livreur',
  phone: user.phone || '',
  adresse: user.address || '',
  photo_url: 'https://via.placeholder.com/150', // Placeholder as API doesn't provide it yet
  statut: 'en_ligne',
  derniere_position_lat: 0,
  derniere_position_lng: 0,
  disponibilite: true,
});

// Helper to map API Order to App Commande
const mapOrderToCommande = (order: any): Commande => ({
  id: order.id,
  numero_commande: order.order_number,
  statut: mapStatus(order.status),
  client_id: order.user_id || 0,
  client_nom: order.customer_name || `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim(),
  client_phone: order.customer_phone || '',
  adresse_livraison: order.shipping_address || `${order.shipping_address || ''}, ${order.shipping_city || ''} ${order.shipping_zipcode || ''}`,
  latitude: 0, // TODO: Geocode or get from API if available
  longitude: 0,
  montant_total: parseFloat(order.total) || 0,
  date_commande: order.created_at,
  date_livraison_prevue: order.created_at, // Placeholder
  preuve_photo_url: null, // Loaded separately or not in list
  livreur_id: order.delivery_user_id || null,
});

const mapStatus = (apiStatus: string): StatutCommande => {
  switch (apiStatus) {
    case 'PENDING': return 'disponible';
    case 'ASSIGNED': return 'assignee';
    case 'PROCESSING': return 'en_route'; // Or 'assignee' depending on flow
    case 'IN_DELIVERY': return 'en_cours';
    case 'DELIVERED': return 'livre';
    case 'FAILED': return 'echec';
    case 'CANCELED': return 'echec';
    default: return 'disponible';
  }
};

const mapAppStatusToApi = (status: StatutCommande): 'EN_ROUTE' | 'DELIVERED' | 'FAILED' => {
  switch (status) {
    case 'en_route': return 'EN_ROUTE';
    case 'en_cours': return 'EN_ROUTE'; // Mapping 'en_cours' to 'EN_ROUTE' for API
    case 'livre': return 'DELIVERED';
    case 'echec': return 'FAILED';
    default: return 'EN_ROUTE';
  }
};

export const useStore = create<AppState>((set, get) => ({
  livreur: null,
  token: null,
  language: 'fr',
  theme: 'auto',
  commandes: [],
  notifications: [],
  assignedDeliveries: [],
  history: [],
  deliveryProofs: {},
  isLoading: false,
  error: null,

  setLivreur: (livreur) => set({ livreur }),
  setToken: (token) => {
    setApiToken(token);
    set({ token });
  },
  setLanguage: (language) => set({ language }),
  setTheme: (theme) => set({ theme }),

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await AuthService.loginUser({ email, password });
      if (response.token && response.user) {
        setApiToken(response.token);
        const livreur = mapUserToLivreur(response.user);
        set({ token: response.token, livreur, isLoading: false });

        // Persist token
        if (storageService) {
          // storageService handles token persistence? 
          // We already did it in setApiToken/api-config, but if storageService has other logic:
          // await storageService.saveToken(response.token);
        }
        return true;
      }
      return false;
    } catch (err: any) {
      console.error('Login error:', err);
      set({ error: err.message || 'Erreur de connexion', isLoading: false });
      return false;
    }
  },

  logout: async () => {
    try {
      await AuthService.logoutUser();
    } catch (e) {
      console.warn('Logout API call failed', e);
    }
    setApiToken(null);
    set({
      livreur: null,
      token: null,
      commandes: [],
      notifications: [],
      assignedDeliveries: [],
      history: [],
      deliveryProofs: {},
    });
    if (storageService) {
      await storageService.clearAll();
    }
  },

  fetchAssignedDeliveries: async () => {
    set({ isLoading: true });
    try {
      const response: any = await DeliveriesService.getMyDeliveries();
      // API returns { data: [...] }
      const data = response.data || response;
      const deliveries = Array.isArray(data) ? data.map(mapOrderToCommande) : [];
      set({ assignedDeliveries: deliveries, isLoading: false });
    } catch (err: any) {
      console.error('Fetch deliveries error:', err);
      set({ error: 'Impossible de charger les livraisons', isLoading: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const response: any = await DeliveriesService.getDeliveryHistory();
      // API returns { data: [...] }
      const data = response.data || response;
      const historyItems: HistoriqueLivraison[] = Array.isArray(data) ? data.map((order: any) => ({
        id: order.id,
        commande_id: order.id,
        livreur_id: 0,
        statut_final: order.status === 'DELIVERED' ? 'livre' : 'echec',
        date_livraison: order.updated_at || order.created_at || new Date().toISOString(),
        preuve_photo_url: null, // TODO: Fetch proof if needed
        numero_commande: order.order_number || 'N/A',
        client_nom: order.customer_name || `${order.customer_first_name || ''} ${order.customer_last_name || ''}`.trim(),
        adresse_livraison: order.shipping_address || `${order.shipping_address || ''}, ${order.shipping_city || ''} ${order.shipping_zipcode || ''}`,
        montant_total: parseFloat(order.total) || 0,
      })) : [];

      set({ history: historyItems, isLoading: false });
    } catch (err: any) {
      console.error('Fetch history error:', err);
      set({ error: 'Impossible de charger l\'historique', isLoading: false });
    }
  },

  assignDelivery: async (delivery: Commande) => {
    set({ isLoading: true });
    try {
      // Note: This function is called from the detail screen when a delivery person wants to take charge
      // The API might not have a specific endpoint for self-assignment
      // For now, we'll just update the local state and mark it as 'assignee'
      // In a real scenario, there should be a backend endpoint for this

      // If the backend has an endpoint like DeliveriesService.assignDelivery, use it:
      // await DeliveriesService.assignDelivery(delivery.id, { delivery_user_id: get().livreur?.id! });

      set((state) => ({
        assignedDeliveries: state.assignedDeliveries.map((d) =>
          d.id === delivery.id ? { ...d, statut: 'assignee' as StatutCommande, livreur_id: state.livreur?.id || null } : d
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error('Assign delivery error:', err);
      set({ error: 'Erreur lors de l\'assignation', isLoading: false });
      throw err;
    }
  },

  updateDeliveryStatus: async (id, newStatus) => {
    set({ isLoading: true });
    try {
      const apiStatus = mapAppStatusToApi(newStatus);
      await DeliveriesService.updateStatus(id, { status: apiStatus });

      set((state) => ({
        assignedDeliveries: state.assignedDeliveries.map((d) =>
          d.id === id ? { ...d, statut: newStatus } : d
        ),
        isLoading: false
      }));
    } catch (err: any) {
      console.error('Update status error:', err);
      set({ error: 'Erreur lors de la mise à jour du statut', isLoading: false });
    }
  },

  addDeliveryProof: async (commandeId, photoUri) => {
    set({ isLoading: true });
    try {
      // React Native specific: prepare file object
      const filename = photoUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename || '');
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const fileObj = {
        uri: photoUri,
        name: filename || 'proof.jpg',
        type,
      };

      // Cast to any because the generated client expects Blob but RN uses object
      await DeliveriesService.uploadProof(commandeId, {
        proof_image: fileObj as any,
        proof_type: 'photo'
      });

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
        isLoading: false
      }));
    } catch (err: any) {
      console.error('Upload proof error:', err);
      set({ error: 'Erreur lors de l\'envoi de la preuve', isLoading: false });
    }
  },

  loadPersistedData: async () => {
    await configureApi();
    const token = OpenAPI.TOKEN;
    if (token && typeof token === 'string') {
      set({ token });
      // Optionally fetch user info and deliveries
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          set({ livreur: mapUserToLivreur(user) });
        }
        // We can also fetch deliveries here
        // get().fetchAssignedDeliveries();
      } catch (e) {
        console.warn('Failed to refresh user session', e);
        // If 401, maybe logout?
        // get().logout();
      }
    }
  },

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
}));

