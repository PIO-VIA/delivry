/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItem } from './OrderItem';
/**
 * Modèle de données complet pour une commande client.
 */
export type Order = {
    /**
     * ID unique de la commande.
     */
    id?: number;
    /**
     * ID de l'utilisateur qui a passé la commande.
     */
    user_id?: number;
    /**
     * Numéro unique de la commande (ex: ORD-20251114-abcxyz).
     */
    order_number?: string;
    /**
     * Statut de la commande.
     */
    status?: Order.status;
    /**
     * Sous-total des articles.
     */
    subtotal?: number;
    /**
     * Frais de livraison.
     */
    shipping?: number;
    /**
     * Taxes appliquées.
     */
    tax?: number;
    /**
     * Prix total final de la commande.
     */
    total?: number;
    /**
     * Prénom du client.
     */
    customer_first_name?: string;
    /**
     * Nom de famille du client.
     */
    customer_last_name?: string;
    /**
     * Email du client.
     */
    customer_email?: string;
    /**
     * Téléphone du client.
     */
    customer_phone?: string;
    /**
     * Adresse de livraison.
     */
    shipping_address?: string;
    /**
     * Ville de livraison.
     */
    shipping_city?: string;
    /**
     * Code postal de livraison.
     */
    shipping_zipcode?: string;
    /**
     * Pays de livraison.
     */
    shipping_country?: string;
    /**
     * Méthode de paiement utilisée.
     */
    payment_method?: string;
    /**
     * Articles inclus dans la commande (relation OrderItem).
     */
    items?: Array<OrderItem>;
    created_at?: string;
    updated_at?: string;
};
export namespace Order {
    /**
     * Statut de la commande.
     */
    export enum status {
        PENDING = 'PENDING',
        PROCESSING = 'PROCESSING',
        PAID = 'PAID',
        SHIPPED = 'SHIPPED',
        DELIVERED = 'DELIVERED',
        CANCELED = 'CANCELED',
        FAILED = 'FAILED',
        IN_DELIVERY = 'IN_DELIVERY',
    }
}

