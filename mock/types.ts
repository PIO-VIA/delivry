// Types TypeScript pour les mock data de l'application de livraison
// Utilisez ces types pour le typage statique dans votre application React Native

/**
 * Type pour un livreur
 */
export interface Livreur {
  id: number;
  username: string;
  email: string;
  password: string; // Mock seulement - ne jamais exposer en production
  role: 'livreur';
  phone: string;
  adresse: string;
  photo_url: string;
  statut: 'en_ligne' | 'hors_ligne';
  derniere_position_lat: number;
  derniere_position_lng: number;
  disponibilite: boolean;
}

/**
 * Type pour un client
 */
export interface Client {
  id: number;
  nom: string;
  email: string;
  phone: string;
  adresse: string;
  ville: string;
}

/**
 * Statuts possibles d'une commande
 */
export type StatutCommande = 'en_attente' | 'en_route' | 'en_cours' | 'livre' | 'echec';

/**
 * Type pour une commande
 */
export interface Commande {
  id: number;
  numero_commande: string;
  statut: StatutCommande;
  client_id: number;
  client_nom: string;
  client_phone: string;
  adresse_livraison: string;
  latitude: number;
  longitude: number;
  montant_total: number;
  date_commande: string; // ISO 8601 format
  date_livraison_prevue: string; // ISO 8601 format
  preuve_photo_url: string | null;
  livreur_id: number | null;
}

/**
 * Types de notifications
 */
export type TypeNotification = 'nouvelle_livraison' | 'changement_statut' | 'rappel';

/**
 * Type pour une notification
 */
export interface Notification {
  id: number;
  type: TypeNotification;
  message: string;
  date: string; // ISO 8601 format
  commande_id: number | null;
  livreur_id: number;
  lu: boolean;
}

/**
 * Type pour l'historique des livraisons
 */
export interface HistoriqueLivraison {
  id: number;
  commande_id: number;
  livreur_id: number;
  statut_final: 'livre' | 'echec';
  date_livraison: string; // ISO 8601 format
  preuve_photo_url: string | null;
}

/**
 * Type pour la réponse de connexion
 */
export interface LoginResponse {
  success: boolean;
  data?: Omit<Livreur, 'password'>;
  token?: string;
  message?: string;
}

/**
 * Type pour les coordonnées GPS
 */
export interface Coordonnees {
  latitude: number;
  longitude: number;
}

/**
 * Type pour les statistiques d'un livreur
 */
export interface StatistiquesLivreur {
  total_livraisons: number;
  livraisons_reussies: number;
  livraisons_echouees: number;
  taux_reussite: number;
  montant_total_livre: number;
}

/**
 * Type pour un détail de commande étendu (avec informations client)
 */
export interface CommandeDetaille extends Commande {
  client: Client;
  livreur?: Omit<Livreur, 'password'>;
}
