/**
 * Statuts possibles d'une commande
 */
export type StatutCommande =
    | 'disponible'
    | 'assignee'
    | 'en_attente'
    | 'en_route'
    | 'en_cours'
    | 'livre'
    | 'echec';

/**
 * Type pour une commande (Compatible avec l'UI existante)
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
 * Type pour un livreur
 */
export interface Livreur {
    id: number;
    username: string;
    email: string;
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
 * Type pour une notification
 */
export interface Notification {
    id: number;
    type: 'nouvelle_livraison' | 'changement_statut' | 'rappel';
    message: string;
    date: string;
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
    date_livraison: string;
    preuve_photo_url: string | null;
    // Expanded fields for UI
    numero_commande: string;
    client_nom: string;
    adresse_livraison: string;
    montant_total: number;
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
