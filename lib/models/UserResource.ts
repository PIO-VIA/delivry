/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Structure de données utilisateur utilisée dans les réponses API (masque le mot de passe)
 */
export type UserResource = {
    id?: number;
    name?: string;
    email?: string;
    role?: UserResource.role;
    phone?: string | null;
    address?: string | null;
    created_at?: string;
    updated_at?: string;
};
export namespace UserResource {
    export enum role {
        ADMIN = 'ADMIN',
        VENDOR = 'VENDOR',
        CUSTOMER = 'CUSTOMER',
        DELIVERY = 'DELIVERY',
        MANAGER = 'MANAGER',
        SUPERVISOR = 'SUPERVISOR',
    }
}

