/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour une catégorie de produits.
 */
export type Category = {
    /**
     * ID unique de la catégorie.
     */
    id?: number;
    /**
     * Nom de la catégorie.
     */
    name?: string;
    /**
     * Slug pour URL.
     */
    slug?: string;
    /**
     * Description de la catégorie.
     */
    description?: string | null;
    /**
     * Chemin vers l'image de la catégorie.
     */
    image?: string | null;
    /**
     * Visibilité de la catégorie (true si visible).
     */
    is_visible?: boolean;
    /**
     * Ordre d'affichage de la catégorie.
     */
    position?: number;
};

