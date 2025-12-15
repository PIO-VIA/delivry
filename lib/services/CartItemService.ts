/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CartItemService {
    /**
     * Get all cart items for a specific cart
     * @param cartId Cart ID
     * @returns any List of cart items
     * @throws ApiError
     */
    public static ca52Ae915104F3D82D08B03C601Cee47(
        cartId: number,
    ): CancelablePromise<{
        status?: string;
        data?: Array<{
            id?: number;
            cart_id?: number;
            product_variant_id?: number;
            quantity?: number;
            unit_price?: number;
            total?: number;
            created_at?: string;
            updated_at?: string;
            product_variant?: {
                id?: number;
                price?: number;
                stock?: number;
                product?: {
                    id?: number;
                    name?: string;
                    description?: string;
                };
            };
        }>;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/cartItems/cart/{cartId}',
            path: {
                'cartId': cartId,
            },
            errors: {
                403: `Unauthorized access`,
                404: `Cart not found`,
            },
        });
    }
    /**
     * Get a single cart item by ID
     * @param cartItemId ID of the cart item
     * @returns any Cart item retrieved successfully
     * @throws ApiError
     */
    public static c7E26Ffb9B88Cf18Ddcebc(
        cartItemId: number,
    ): CancelablePromise<{
        status?: string;
        data?: {
            id?: number;
            cart_id?: number;
            product_variant_id?: number;
            quantity?: number;
            unit_price?: number;
            total?: number;
            created_at?: string;
            updated_at?: string;
        };
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/cartItems/{cartItemId}',
            path: {
                'cartItemId': cartItemId,
            },
            errors: {
                403: `Unauthorized`,
                404: `Cart item not found`,
            },
        });
    }
    /**
     * Update an existing cart item
     * @param cartItemId ID of the cart item to update
     * @param requestBody
     * @returns any Cart item updated successfully
     * @throws ApiError
     */
    public static efcd68Eb08D14Cc121A69Cddb1(
        cartItemId: number,
        requestBody: {
            quantity: number;
            cart_id: number;
            product_variant_id: number;
        },
    ): CancelablePromise<{
        status?: string;
        message?: string;
        data?: Record<string, any>;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/cartItems/{cartItemId}',
            path: {
                'cartItemId': cartItemId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Unauthorized`,
                404: `Cart item not found`,
                422: `Validation error or insufficient stock`,
            },
        });
    }
    /**
     * Delete a cart item
     * @param cartItemId ID of the cart item to delete
     * @returns any Cart item deleted successfully
     * @throws ApiError
     */
    public static fe541984A1B64B350A44D643E678(
        cartItemId: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/cartItems/{cartItemId}',
            path: {
                'cartItemId': cartItemId,
            },
            errors: {
                403: `Unauthorized`,
                404: `Cart item not found`,
            },
        });
    }
    /**
     * Add a new cart item
     * @param requestBody
     * @returns any Cart item created successfully
     * @throws ApiError
     */
    public static dc9045Ea47Ded10C062F6C971Ae2B4Aa(
        requestBody: {
            quantity: number;
            cart_id: number;
            product_variant_id: number;
        },
    ): CancelablePromise<{
        status?: string;
        data?: Record<string, any>;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/cartItems',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Unauthorized`,
                422: `Validation error or insufficient stock`,
            },
        });
    }
}
