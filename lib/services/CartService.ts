/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartService {
    /**
     * Get user's cart
     * @returns any Successful operation
     * @throws ApiError
     */
    public static a8631F1Ac30C83B5Ad826Df8Fda966F(): CancelablePromise<{
        status?: string;
        data?: {
            id?: number;
            user_id?: number | null;
            session_id?: string;
            items_count?: number;
            total?: number;
            items?: Array<{
                id?: number;
                quantity?: number;
                unit_price?: number;
                total?: number;
                product_variant?: {
                    id?: number;
                    price?: number;
                    stock?: number;
                    product?: {
                        id?: number;
                        name?: string;
                        slug?: string;
                    };
                };
            }>;
        };
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/cart',
            errors: {
                500: `Server error`,
            },
        });
    }
    /**
     * Create or get cart
     * @returns any Cart retrieved or created
     * @throws ApiError
     */
    public static b432C7Bbb8B06Ea2019C3D37F23258Ca(): CancelablePromise<{
        status?: string;
        data?: Record<string, any>;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cart',
        });
    }
    /**
     * Add item to cart
     * @param requestBody
     * @returns any Item added to cart
     * @throws ApiError
     */
    public static c0E8Ca78699Ccc07858444Da702D3Ac5(
        requestBody: {
            product_variant_id: number;
            quantity: number;
        },
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cart/add',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * Update cart item quantity
     * @param cartItem Cart Item ID
     * @param requestBody
     * @returns any Cart item updated
     * @throws ApiError
     */
    public static dca79C7Ed9C583C1598Cb450Fc5D(
        cartItem: number,
        requestBody: {
            quantity: number;
        },
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/cart/items/{cartItem}',
            path: {
                'cartItem': cartItem,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Cart item not found`,
            },
        });
    }
    /**
     * Remove item from cart
     * @param cartItem Cart Item ID
     * @returns any Item removed from cart
     * @throws ApiError
     */
    public static d114A15678817E115627D0Eace73231(
        cartItem: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart/items/{cartItem}',
            path: {
                'cartItem': cartItem,
            },
            errors: {
                404: `Cart item not found`,
            },
        });
    }
    /**
     * Clear the cart
     * @returns any Cart cleared successfully
     * @throws ApiError
     */
    public static c2Cf94402630Acad1Cc6D317Ec806693(): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart/clear',
        });
    }
    /**
     * Empty user's cart (Admin only or self)
     * @param userId User ID
     * @returns any Cart emptied successfully
     * @throws ApiError
     */
    public static b4B3682E4Ea427A01Ca620Dc8E5818(
        userId: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cart/user/{userId}/empty',
            path: {
                'userId': userId,
            },
            errors: {
                403: `Unauthorized`,
            },
        });
    }
}
