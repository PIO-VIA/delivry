import {
  loginLivreur,
  getCommandesByLivreur,
  getNotificationsByLivreur,
  getHistoriqueByLivreur,
  getStatistiquesLivreur,
  getCommandeById,
} from '@/mock';
import { LoginResponse, Commande, Notification, HistoriqueLivraison, StatistiquesLivreur } from '@/mock/types';

const simulateDelay = (ms: number = 500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    await simulateDelay();
    return loginLivreur(email, password);
  },

  async getMyDeliveries(livreurId: number): Promise<Commande[]> {
    await simulateDelay();
    return getCommandesByLivreur(livreurId);
  },

  async getMyNotifications(livreurId: number): Promise<Notification[]> {
    await simulateDelay();
    return getNotificationsByLivreur(livreurId);
  },

  async getMyHistory(livreurId: number): Promise<HistoriqueLivraison[]> {
    await simulateDelay();
    return getHistoriqueByLivreur(livreurId);
  },

  async getMyStatistics(livreurId: number): Promise<StatistiquesLivreur> {
    await simulateDelay();
    return getStatistiquesLivreur(livreurId);
  },

  async getDeliveryDetails(commandeId: number): Promise<Commande | undefined> {
    await simulateDelay();
    return getCommandeById(commandeId);
  },

  async updateDeliveryStatus(
    commandeId: number,
    status: Commande['statut']
  ): Promise<{ success: boolean; message?: string }> {
    await simulateDelay();
    return { success: true, message: 'Statut mis à jour' };
  },

  async markNotificationAsRead(notificationId: number): Promise<{ success: boolean }> {
    await simulateDelay(200);
    return { success: true };
  },
};

export default mockApi;
