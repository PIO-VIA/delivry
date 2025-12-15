/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProductVariant } from '../models/ProductVariant';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductVariantsService {
    /**
     * Get all variants for a product
     * @param product Product ID
     * @returns any List of product variants
     * @throws ApiError
     */
    public static e90De3Bd67Ba1Bf646A47827C51D16F5(
        product: number,
    ): CancelablePromise<{
        status?: string;
        data?: Array<ProductVariant>;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/{product}/variants',
            path: {
                'product': product,
            },
            errors: {
                404: `Product not found`,
            },
        });
    }
    /**
     * Create a new product variant
     * @param product Product ID
     * @param formData
     * @returns any Variant created successfully
     * @throws ApiError
     */
    public static d0E4Aa749F3Cbbfbd48C99Ed4C858(
        product: number,
        formData: {
            name: string;
            sku: string;
            price: number;
            stock: number;
            color: string;
            attributes?: Record<string, any>;
            /**
             * Main variant image file
             */
            image?: Blob | null;
        },
    ): CancelablePromise<{
        status?: string;
        data?: ProductVariant;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/products/{product}/variants',
            path: {
                'product': product,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * Get a specific product variant
     * @param variant Variant ID
     * @returns any Variant details
     * @throws ApiError
     */
    public static cdb66Cdb7E85Bc8A58E669901D43(
        variant: number,
    ): CancelablePromise<{
        status?: string;
        data?: ProductVariant;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/variants/{variant}',
            path: {
                'variant': variant,
            },
            errors: {
                404: `Variant not found`,
            },
        });
    }
    /**
     * Update a product variant (Use POST with _method=PUT for file upload)
     * @param variant Variant ID
     * @param formData
     * @returns any Variant updated successfully
     * @throws ApiError
     */
    public static c2Eb5C85502C053731274F321A6Ce(
        variant: number,
        formData: {
            /**
             * Required for method spoofing with multipart/form-data
             */
            _method?: string;
            name?: string;
            sku?: string;
            price?: number;
            stock?: number;
            color?: string;
            attributes?: Record<string, any>;
            /**
             * New variant image file
             */
            image?: Blob | null;
            /**
             * Set to true to delete current image.
             */
            remove_image?: boolean | null;
        },
    ): CancelablePromise<{
        status?: string;
        data?: ProductVariant;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/variants/{variant}',
            path: {
                'variant': variant,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * Delete a product variant
     * @param variant Variant ID
     * @returns any Variant deleted successfully
     * @throws ApiError
     */
    public static d7F2C667C701Dfba05C62226075A0Eb6(
        variant: number,
    ): CancelablePromise<{
        status?: string;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/variants/{variant}',
            path: {
                'variant': variant,
            },
            errors: {
                404: `Variant not found`,
            },
        });
    }
}
