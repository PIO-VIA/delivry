/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour une variante de produit
 */
export type ProductVariant = {
    /**
     * ID unique
     */
    id?: number;
    /**
     * ID du produit parent
     */
    productId: number;
    /**
     * Nom de la variante
     */
    name: string;
    /**
     * Code SKU
     */
    sku: string;
    /**
     * Prix
     */
    price: number;
    /**
     * Quantité en stock
     */
    stock: number;
    /**
     * Couleur
     */
    color: string;
    /**
     * Attributs de la variante
     */
    attributes?: Record<string, any>;
    /**
     * Image de la variante
     */
    image?: string;
    created_at?: string;
    updated_at?: string;
};

