// Mock data centralisé pour l'application de livraison
// Importez ce fichier pour accéder à toutes les données mock

import livreurs from './livreurs';
import clients from './clients';
import commandes from './commandes';
import notifications from './notifications';
import historiqueLivraisons from './historique';

// Fonctions utilitaires pour manipuler les mock data

/**
 * Obtenir un livreur par son ID
 */
export const getLivreurById = (id) => {
  return livreurs.find(livreur => livreur.id === id);
};

/**
 * Obtenir un client par son ID
 */
export const getClientById = (id) => {
  return clients.find(client => client.id === id);
};

/**
 * Obtenir une commande par son ID
 */
export const getCommandeById = (id) => {
  return commandes.find(commande => commande.id === id);
};

/**
 * Obtenir les commandes par statut
 */
export const getCommandesByStatut = (statut) => {
  return commandes.filter(commande => commande.statut === statut);
};

/**
 * Obtenir les commandes d'un livreur
 */
export const getCommandesByLivreur = (livreurId) => {
  return commandes.filter(commande => commande.livreur_id === livreurId);
};

/**
 * Obtenir les notifications d'un livreur
 */
export const getNotificationsByLivreur = (livreurId) => {
  return notifications.filter(notification => notification.livreur_id === livreurId);
};

/**
 * Obtenir les notifications non lues d'un livreur
 */
export const getUnreadNotificationsByLivreur = (livreurId) => {
  return notifications.filter(
    notification => notification.livreur_id === livreurId && !notification.lu
  );
};

/**
 * Obtenir l'historique d'un livreur
 */
export const getHistoriqueByLivreur = (livreurId) => {
  return historiqueLivraisons.filter(historique => historique.livreur_id === livreurId);
};

/**
 * Obtenir les livreurs en ligne
 */
export const getLivreursEnLigne = () => {
  return livreurs.filter(livreur => livreur.statut === 'en_ligne');
};

/**
 * Obtenir les livreurs disponibles
 */
export const getLivreursDisponibles = () => {
  return livreurs.filter(livreur => livreur.disponibilite === true);
};

/**
 * Simuler une connexion livreur
 */
export const loginLivreur = (email, password) => {
  const livreur = livreurs.find(
    l => l.email === email && l.password === password
  );

  if (livreur) {
    // Retirer le mot de passe de la réponse
    const { password, ...livreurData } = livreur;
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

// Exports des données brutes
export {
  livreurs,
  clients,
  commandes,
  notifications,
  historiqueLivraisons,
};

// Export par défaut avec toutes les données
export default {
  livreurs,
  clients,
  commandes,
  notifications,
  historiqueLivraisons,
  // Fonctions utilitaires
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
};
