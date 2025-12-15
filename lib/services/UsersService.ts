/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UserResource } from '../models/UserResource';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class UsersService {
    /**
     * Get all users with filtering and pagination (Management Roles only)
     * @param role Filter by role
     * @param perPage Items per page
     * @returns any List of users
     * @throws ApiError
     */
    public static c457726701591D1183B53Aa71Fc13441(
        role?: 'CUSTOMER' | 'ADMIN' | 'VENDOR' | 'DELIVERY' | 'MANAGER' | 'SUPERVISOR',
        perPage: number = 15,
    ): CancelablePromise<{
        message?: string;
        data?: Array<UserResource>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users',
            query: {
                'role': role,
                'per_page': perPage,
            },
            errors: {
                403: `Forbidden - Management role required`,
            },
        });
    }
    /**
     * Create a new user (Admin/Manager/Supervisor only)
     * @param requestBody
     * @returns any User created successfully
     * @throws ApiError
     */
    public static a0265360B2014512D6Dbfaf0E7(
        requestBody: {
            name: string;
            email: string;
            password: string;
            password_confirmation?: string;
            role: 'CUSTOMER' | 'ADMIN' | 'VENDOR' | 'DELIVERY' | 'MANAGER' | 'SUPERVISOR';
            phone?: string;
            address?: string;
        },
    ): CancelablePromise<{
        message?: string;
        data?: UserResource;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/users',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - Admin/Manager/Supervisor role required`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get authenticated user's profile details
     * @returns any User profile retrieved successfully
     * @throws ApiError
     */
    public static cc84Ad78F7572292B07E6Fbe4Bce(): CancelablePromise<{
        message?: string;
        data?: UserResource;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/me',
        });
    }
    /**
     * Get user details by ID (Management Roles only)
     * @param user
     * @returns any User details
     * @throws ApiError
     */
    public static d3A14968F8B7A072620C75C7C78Ed6F8(
        user: number,
    ): CancelablePromise<{
        message?: string;
        data?: UserResource;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/{user}',
            path: {
                'user': user,
            },
            errors: {
                404: `User not found`,
            },
        });
    }
    /**
     * Update user (Admin/Manager/Supervisor only)
     * @param user User ID
     * @param requestBody
     * @returns any User updated successfully
     * @throws ApiError
     */
    public static e29Fc231C7937Ab09483D35E6E3D1214(
        user: number,
        requestBody: {
            name: string;
            email: string;
            role: 'CUSTOMER' | 'ADMIN' | 'VENDOR' | 'DELIVERY' | 'MANAGER' | 'SUPERVISOR';
            password?: string;
            password_confirmation?: string;
        },
    ): CancelablePromise<{
        message?: string;
        data?: UserResource;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/users/{user}',
            path: {
                'user': user,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - Admin/Manager/Supervisor role required`,
                404: `User not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Delete user (Management Roles only)
     * @param user
     * @returns any User deleted successfully
     * @throws ApiError
     */
    public static e0F9A385A1D6788B99E519Bd98Cf7239(
        user: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/users/{user}',
            path: {
                'user': user,
            },
            errors: {
                403: `Forbidden`,
                404: `User not found`,
            },
        });
    }
    /**
     * Get user statistics by role (Management Roles only)
     * @returns any User statistics
     * @throws ApiError
     */
    public static ed2Abc2C1F2E4965Fa61226D51D83F11(): CancelablePromise<{
        message?: string;
        data?: {
            total_users?: number;
            clients_count?: number;
            admins_count?: number;
            vendors_count?: number;
            delivery_count?: number;
            managers_count?: number;
            supervisors_count?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/users/stats',
        });
    }
    /**
     * Enregistre le token Firebase Cloud Messaging (FCM) de l'utilisateur pour les notifications Push.
     * @param requestBody
     * @returns string Token FCM enregistré avec succès.
     * @throws ApiError
     */
    public static b44C776D6F32Bd2912B74287C1189C(
        requestBody: {
            /**
             * Le token FCM unique de l'appareil mobile.
             */
            fcm_token: string;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/fcm-token',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Non authentifié.`,
            },
        });
    }
}
