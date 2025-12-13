import { create } from 'zustand';
import { Livreur, Commande, Notification } from '@/mock/types';
import { ThemeMode } from '@/theme';

interface AppState {
  livreur: Omit<Livreur, 'password'> | null;
  token: string | null;
  language: 'fr' | 'en';
  theme: ThemeMode;
  commandes: Commande[];
  notifications: Notification[];

  setLivreur: (livreur: Omit<Livreur, 'password'> | null) => void;
  setToken: (token: string | null) => void;
  setLanguage: (language: 'fr' | 'en') => void;
  setTheme: (theme: ThemeMode) => void;
  setCommandes: (commandes: Commande[]) => void;
  setNotifications: (notifications: Notification[]) => void;
  updateCommande: (id: number, updates: Partial<Commande>) => void;
  markNotificationAsRead: (id: number) => void;
  markAllNotificationsAsRead: () => void;
  logout: () => void;
}

export const useStore = create<AppState>((set) => ({
  livreur: null,
  token: null,
  language: 'fr',
  theme: 'auto',
  commandes: [],
  notifications: [],

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

  logout: () =>
    set({
      livreur: null,
      token: null,
      commandes: [],
      notifications: [],
    }),
}));
