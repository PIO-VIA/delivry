/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class NotificationsService {
    /**
     * Teste l'envoi de l'e-mail de confirmation d'inscription.
     * Nécessite qu'un utilisateur avec l'ID 1 existe.
     * @returns any E-mail de test d'inscription envoyé avec succès (Vérifiez la console pour les erreurs).
     * @throws ApiError
     */
    public static testRegistrationEmail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/notifications/test-registration',
            errors: {
                404: `Utilisateur non trouvé.`,
                500: `Erreur d'envoi d'e-mail.`,
            },
        });
    }
    /**
     * Teste l'envoi de l'e-mail de confirmation de commande.
     * Nécessite qu'un utilisateur avec l'ID 1 existe.
     * @returns any E-mail de test de commande envoyé avec succès.
     * @throws ApiError
     */
    public static testOrderEmail(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/notifications/test-order',
        });
    }
}
