/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CategoryResource } from '../models/CategoryResource';
import type { ProductResource } from '../models/ProductResource';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Get all categories (Public)
     * @param perPage
     * @returns any List of categories
     * @throws ApiError
     */
    public static f5817A34833D0A1F4Af4548Dd3Aeaba(
        perPage: number = 15,
    ): CancelablePromise<{
        message?: string;
        data?: Array<CategoryResource>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories',
            query: {
                'per_page': perPage,
            },
        });
    }
    /**
     * Create a new category (Admin only)
     * @param formData
     * @returns any Category created successfully
     * @throws ApiError
     */
    public static fcad552Bb0Eaba9Fb191Fd8D8Dcab0(
        formData: {
            name: string;
            description?: string;
            /**
             * Category image file
             */
            image?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/categories',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Access denied. Admin role required.`,
                422: `Validation failed`,
            },
        });
    }
    /**
     * Get category details (Public)
     * @param category
     * @returns any Category details
     * @throws ApiError
     */
    public static e92579E78391B6199E78C2A091Dbea0A(
        category: number,
    ): CancelablePromise<{
        message?: string;
        data?: CategoryResource;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{category}',
            path: {
                'category': category,
            },
        });
    }
    /**
     * Update category (using POST with _method=PUT for file support) (Admin only)
     * @param category
     * @param formData
     * @returns any Category updated successfully
     * @throws ApiError
     */
    public static a56362Beb1F73F80Cda349F999(
        category: number,
        formData: {
            /**
             * Required for method spoofing in multipart forms
             */
            _method: 'PUT';
            name: string;
            description?: string;
            /**
             * New image file (optional)
             */
            image?: Blob;
            /**
             * Set to true to remove the current image.
             */
            remove_image?: boolean;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/categories/{category}',
            path: {
                'category': category,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Access denied. Admin role required.`,
            },
        });
    }
    /**
     * Delete category (Admin only)
     * @param category
     * @returns any Category deleted successfully
     * @throws ApiError
     */
    public static d9Ecd5C4A74C4D75339251863Eedc08C(
        category: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/categories/{category}',
            path: {
                'category': category,
            },
            errors: {
                403: `Access denied. Admin role required.`,
                422: `Cannot delete category with associated products.`,
            },
        });
    }
    /**
     * Get products by category (Public)
     * @param category
     * @param perPage
     * @returns any List of products in category
     * @throws ApiError
     */
    public static fd6Df6Badf6Fa2Fdee6439C6Eb6E3D(
        category: number,
        perPage: number = 15,
    ): CancelablePromise<{
        message?: string;
        data?: Array<ProductResource>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/categories/{category}/products',
            path: {
                'category': category,
            },
            query: {
                'per_page': perPage,
            },
        });
    }
}
