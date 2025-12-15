/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour un article dans un panier.
 */
export type CartItem = {
    /**
     * ID unique de l'article
     */
    id?: number;
    /**
     * ID du panier
     */
    cart_id?: number;
    /**
     * ID du produit (ou variante) - À CHANGER
     */
    product_variant_id?: number;
    /**
     * Quantité de ce produit dans le panier.
     */
    quantity?: number;
    /**
     * Prix unitaire au moment de l'ajout.
     */
    unit_price?: number;
    /**
     * Prix total pour cet article
     */
    total?: number;
    /**
     * Date de création
     */
    created_at?: string;
    /**
     * Date de mise à jour
     */
    updated_at?: string;
};

