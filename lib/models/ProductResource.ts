/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Structure de données d'un produit dans les réponses API (utilisée par ProductResource).
 */
export type ProductResource = {
    id?: number;
    category_id?: number;
    name?: string;
    slug?: string;
    price?: number;
    /**
     * Prix formaté par l'accessoire
     */
    formatted_price?: string;
    has_discount?: boolean;
    discount_percentage?: number | null;
    image?: string | null;
    is_visible?: boolean;
    created_at?: string;
};

