/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour un article spécifique dans une commande.
 */
export type OrderItem = {
    /**
     * ID unique de l'article de commande.
     */
    id?: number;
    /**
     * ID de la commande parente.
     */
    order_id?: number;
    /**
     * ID du produit original.
     */
    product_id?: number;
    /**
     * Nom du produit au moment de la commande.
     */
    product_name?: string;
    /**
     * SKU du produit au moment de la commande.
     */
    product_sku?: string;
    /**
     * Quantité commandée.
     */
    quantity?: number;
    /**
     * Prix unitaire du produit au moment de la commande.
     */
    unit_price?: number;
    /**
     * Prix total (quantité * prix unitaire).
     */
    total?: number;
};

