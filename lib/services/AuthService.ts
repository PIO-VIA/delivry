/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AuthService {
    /**
     * Enregistrement d'un nouvel utilisateur
     * @param requestBody
     * @returns any Enregistrement réussi. Retourne le jeton d'accès.
     * @throws ApiError
     */
    public static registerUser(
        requestBody: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
            phone?: string | null;
            address?: string | null;
        },
    ): CancelablePromise<{
        message?: string;
        token?: string;
        user?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Erreur de validation des données.`,
            },
        });
    }
    /**
     * Enregistrement d'un  administrateur
     * @param requestBody
     * @returns any Enregistrement réussi. Retourne le jeton d'accès.
     * @throws ApiError
     */
    public static registerAdmin(
        requestBody: {
            name: string;
            email: string;
            password: string;
            password_confirmation: string;
            phone?: string | null;
            address?: string | null;
        },
    ): CancelablePromise<{
        message?: string;
        token?: string;
        user?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/registerAdmin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Erreur de validation des données.`,
            },
        });
    }
    /**
     * Connexion de l'utilisateur
     * @param requestBody
     * @returns any Connexion réussie. Retourne le jeton d'accès.
     * @throws ApiError
     */
    public static loginUser(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<{
        message?: string;
        token?: string;
        user?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Identifiants invalides.`,
            },
        });
    }
    /**
     * Déconnexion de l'utilisateur
     * Supprime le jeton d'accès actuel de l'utilisateur.
     * @returns any Déconnexion réussie.
     * @throws ApiError
     */
    public static logoutUser(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/logout',
            errors: {
                401: `Non authentifié.`,
            },
        });
    }
    /**
     * Obtenir les informations de l'utilisateur actuel
     * Retourne les données de l'utilisateur authentifié via le jeton Bearer.
     * @returns any Informations utilisateur récupérées.
     * @throws ApiError
     */
    public static getCurrentUser(): CancelablePromise<{
        id?: number;
        name?: string;
        email?: string;
        role?: string;
        created_at?: string;
        updated_at?: string;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user',
            errors: {
                401: `Non authentifié.`,
            },
        });
    }
}
