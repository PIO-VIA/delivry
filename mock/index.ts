import livreurs from './livreurs';
import clients from './clients';
import commandes from './commandes';
import notifications from './notifications';
import historiqueLivraisons from './historique';
import {
  Livreur,
  Client,
  Commande,
  Notification,
  HistoriqueLivraison,
  LoginResponse,
  StatistiquesLivreur,
} from './types';

export const getLivreurById = (id: number): Livreur | undefined => {
  return livreurs.find(livreur => livreur.id === id);
};

export const getClientById = (id: number): Client | undefined => {
  return clients.find(client => client.id === id);
};

export const getCommandeById = (id: number): Commande | undefined => {
  return commandes.find(commande => commande.id === id);
};

export const getCommandesByStatut = (statut: Commande['statut']): Commande[] => {
  return commandes.filter(commande => commande.statut === statut);
};

export const getCommandesByLivreur = (livreurId: number): Commande[] => {
  return commandes.filter(commande => commande.livreur_id === livreurId);
};

export const getNotificationsByLivreur = (livreurId: number): Notification[] => {
  return notifications.filter(notification => notification.livreur_id === livreurId);
};

export const getUnreadNotificationsByLivreur = (livreurId: number): Notification[] => {
  return notifications.filter(
    notification => notification.livreur_id === livreurId && !notification.lu
  );
};

export const getHistoriqueByLivreur = (livreurId: number): HistoriqueLivraison[] => {
  return historiqueLivraisons.filter(historique => historique.livreur_id === livreurId);
};

export const getLivreursEnLigne = (): Livreur[] => {
  return livreurs.filter(livreur => livreur.statut === 'en_ligne');
};

export const getLivreursDisponibles = (): Livreur[] => {
  return livreurs.filter(livreur => livreur.disponibilite === true);
};

export const loginLivreur = (email: string, password: string): LoginResponse => {
  const livreur = livreurs.find(
    l => l.email === email && l.password === password
  );

  if (livreur) {
    const { password: _, ...livreurData } = livreur;
    return {
      success: true,
      data: livreurData,
      token: `mock_token_${livreur.id}_${Date.now()}`,
    };
  }

  return {
    success: false,
    message: 'Email ou mot de passe incorrect',
  };
};

export const getStatistiquesLivreur = (livreurId: number): StatistiquesLivreur => {
  const historique = getHistoriqueByLivreur(livreurId);
  const livraisons_reussies = historique.filter(h => h.statut_final === 'livre').length;
  const livraisons_echouees = historique.filter(h => h.statut_final === 'echec').length;
  const total_livraisons = historique.length;

  const commandesLivrees = historique
    .filter(h => h.statut_final === 'livre')
    .map(h => getCommandeById(h.commande_id))
    .filter((c): c is Commande => c !== undefined);

  const montant_total_livre = commandesLivrees.reduce((sum, cmd) => sum + cmd.montant_total, 0);

  return {
    total_livraisons,
    livraisons_reussies,
    livraisons_echouees,
    taux_reussite: total_livraisons > 0 ? (livraisons_reussies / total_livraisons) * 100 : 0,
    montant_total_livre,
  };
};

export {
  livreurs,
  clients,
  commandes,
  notifications,
  historiqueLivraisons,
};

export default {
  livreurs,
  clients,
  commandes,
  notifications,
  historiqueLivraisons,
  getLivreurById,
  getClientById,
  getCommandeById,
  getCommandesByStatut,
  getCommandesByLivreur,
  getNotificationsByLivreur,
  getUnreadNotificationsByLivreur,
  getHistoriqueByLivreur,
  getLivreursEnLigne,
  getLivreursDisponibles,
  loginLivreur,
  getStatistiquesLivreur,
};
