/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CartItem } from './CartItem';
/**
 * Modèle de données pour un panier d'achat.
 */
export type Cart = {
    /**
     * ID unique du panier.
     */
    id?: number;
    /**
     * ID de l'utilisateur associé à ce panier.
     */
    user_id?: number;
    /**
     * ID de session pour les utilisateurs non connectés.
     */
    session_id?: string;
    /**
     * Nombre total d'articles dans le panier.
     */
    items_count?: number;
    /**
     * Prix total du panier.
     */
    total?: number;
    /**
     * Liste des articles dans le panier.
     */
    items?: Array<CartItem>;
    /**
     * Date de création
     */
    created_at?: string;
    /**
     * Date de mise à jour
     */
    updated_at?: string;
};

