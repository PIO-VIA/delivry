/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DeliveriesService {
    /**
     * Get orders ready to be assigned to a delivery person (Management Roles only)
     * @returns any List of pending orders
     * @throws ApiError
     */
    public static be3212B130Cf9Cb314360583576(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/deliveries/pending',
            errors: {
                403: `Forbidden - Management role required`,
            },
        });
    }
    /**
     * Assign an order to a delivery person (Management Roles only)
     * @param order
     * @param requestBody
     * @returns any Order assigned successfully
     * @throws ApiError
     */
    public static df5E30Aeac209B67Af78B8F64Cb4Ef93(
        order: number,
        requestBody: {
            delivery_user_id: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/deliveries/{order}/assign',
            path: {
                'order': order,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
                404: `Order or Delivery user not found`,
            },
        });
    }
    /**
     * Get deliveries assigned to the authenticated user (Delivery Role only)
     * @returns any List of deliveries
     * @throws ApiError
     */
    public static b1710B79E368Dde26652D27376Ea(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/deliveries/my',
            errors: {
                403: `Forbidden - Delivery role required`,
            },
        });
    }
    /**
     * Affiche l'historique des livraisons terminées (Livré, Échec) pour le livreur connecté (Delivery Role only).
     * @returns any Liste des commandes terminées.
     * @throws ApiError
     */
    public static a8E060Acca5Eb87A6660C2247F1178B9(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/deliveries/history',
            errors: {
                403: `Accès refusé (non-livreur).`,
            },
        });
    }
    /**
     * Update the delivery status of an order (Assigned Delivery Role only)
     * @param order
     * @param requestBody
     * @returns any Status updated successfully
     * @throws ApiError
     */
    public static ac72B6646F9Cb07D9C89Fc4E5Bf8A1(
        order: number,
        requestBody: {
            status: 'EN_ROUTE' | 'DELIVERED' | 'FAILED';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/deliveries/{order}/status',
            path: {
                'order': order,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden`,
            },
        });
    }
    /**
     * Update the authenticated delivery person's current GPS location (Delivery Role only)
     * @param requestBody
     * @returns any Location updated successfully
     * @throws ApiError
     */
    public static a9311624E529B78B043Ffdf1Fb70B7Db(
        requestBody: {
            latitude: number;
            longitude: number;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/deliveries/location',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - Delivery role required`,
            },
        });
    }
    /**
     * Get all active delivery persons' live locations for the admin map (Management Roles only)
     * @returns any List of live locations
     * @throws ApiError
     */
    public static aba8C7Cb27856320D7387Bcc142Ff0(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/deliveries/live/map',
            errors: {
                403: `Forbidden - Management role required`,
            },
        });
    }
    /**
     * Get the delivery proof path (Admin/Manager/Supervisor/Client/Assigned Delivery)
     * @param order
     * @returns any Proof URL retrieved successfully
     * @throws ApiError
     */
    public static bff3Bc4B0Ebb03D6949E5F5D7A93(
        order: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/deliveries/{order}/proof',
            path: {
                'order': order,
            },
            errors: {
                403: `Forbidden`,
                404: `Proof not found`,
            },
        });
    }
    /**
     * Uploads the proof of delivery (image) for an order (Assigned Delivery Role only)
     * @param order
     * @param formData
     * @returns any Proof uploaded successfully
     * @throws ApiError
     */
    public static d9E4A2930E06E32E86Ffc071382D8694(
        order: number,
        formData: {
            proof_image?: Blob;
            proof_type?: 'photo' | 'signature' | 'qr';
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/deliveries/{order}/proof',
            path: {
                'order': order,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Forbidden`,
            },
        });
    }
}
