/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour un produit de la boutique
 */
export type Product = {
    /**
     * ID du produit
     */
    id?: number;
    /**
     * ID de la catégorie associée
     */
    category_id?: number | null;
    /**
     * Nom du produit
     */
    name?: string;
    /**
     * Slug unique pour l'URL
     */
    slug?: string;
    /**
     * Description détaillée
     */
    description?: string | null;
    /**
     * Prix actuel
     */
    price?: number;
    /**
     * Ancien prix pour afficher une réduction
     */
    compare_price?: number | null;
    /**
     * Quantité en stock
     */
    stock?: number;
    /**
     * Code SKU
     */
    sku?: string | null;
    /**
     * Code-barres
     */
    barcode?: string | null;
    /**
     * Visibilité sur la boutique (true/false)
     */
    is_visible?: boolean;
    /**
     * Produit mis en avant sur la page d'accueil
     */
    is_featured?: boolean;
    /**
     * Date de publication
     */
    published_at?: string | null;
    /**
     * Titre SEO
     */
    meta_title?: string | null;
    /**
     * Description SEO
     */
    meta_description?: string | null;
    /**
     * Chemin de l'image principale
     */
    image?: string | null;
    /**
     * Galerie d'images
     */
    gallery?: Array<string>;
    created_at?: string;
    updated_at?: string;
};

