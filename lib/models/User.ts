/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Modèle de données pour un utilisateur
 */
export type User = {
    /**
     * ID de l'utilisateur
     */
    id?: number;
    /**
     * Nom complet de l'utilisateur
     */
    name?: string;
    /**
     * Adresse email unique
     */
    email?: string;
    /**
     * Numero de telephone
     */
    phone?: string | null;
    /**
     * Adresse
     */
    address?: string | null;
    /**
     * Rôle de l'utilisateur
     */
    role?: User.role;
    /**
     * Date de création de l'utilisateur
     */
    created_at?: string;
    /**
     * Date de dernière mise à jour
     */
    updated_at?: string;
};
export namespace User {
    /**
     * Rôle de l'utilisateur
     */
    export enum role {
        ADMIN = 'ADMIN',
        VENDOR = 'VENDOR',
        CUSTOMER = 'CUSTOMER',
        DELIVERY = 'DELIVERY',
        MANAGER = 'MANAGER',
        SUPERVISOR = 'SUPERVISOR',
    }
}

