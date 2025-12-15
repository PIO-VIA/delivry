/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Product } from '../models/Product';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class ProductsService {
    /**
     * Get a list of all visible products (Public Access)
     * @param search Search term for product name/description.
     * @param category Filter by category ID.
     * @param perPage Number of products per page.
     * @returns any Products retrieved successfully
     * @throws ApiError
     */
    public static bfaa78D1C2C3848Ab8165C5Dadcad3E(
        search?: string,
        category?: number,
        perPage: number = 10,
    ): CancelablePromise<{
        message?: string;
        data?: Array<Product>;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products',
            query: {
                'search': search,
                'category': category,
                'per_page': perPage,
            },
        });
    }
    /**
     * Create a new product
     * @param formData
     * @returns any Product created successfully
     * @throws ApiError
     */
    public static e8185E307706E2Cd84Bbcf5171E2F09D(
        formData: {
            name: string;
            description?: string;
            price: number;
            compare_price?: number;
            stock: number;
            sku?: string;
            category_id: number;
            is_visible?: boolean;
            is_featured?: boolean;
            /**
             * Product image file (max 2MB)
             */
            image?: Blob;
        },
    ): CancelablePromise<{
        message?: string;
        data?: Product;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/products',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Access denied. Admin or Vendor role required.`,
            },
        });
    }
    /**
     * Get product details by slug (Public Access)
     * @param slug Product slug (e.g., iphone-15-pro)
     * @returns any Product details retrieved successfully
     * @throws ApiError
     */
    public static eb94Cf22F00Aa181040441A8Ae7B07E(
        slug: string,
    ): CancelablePromise<{
        message?: string;
        data?: Product;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/{slug}',
            path: {
                'slug': slug,
            },
            errors: {
                404: `Product not found`,
            },
        });
    }
    /**
     * Update product (Use POST with _method=PUT for file upload)
     * @param id Product ID
     * @param formData
     * @returns any Product updated successfully
     * @throws ApiError
     */
    public static b4B789A4A3D0C47897F43991A5F12372(
        id: number,
        formData: {
            /**
             * Required for method spoofing
             */
            _method?: string;
            name?: string;
            description?: string;
            price?: number;
            compare_price?: number;
            stock?: number;
            sku?: string;
            category_id?: number;
            is_visible?: boolean;
            is_featured?: boolean;
            /**
             * New product image file
             */
            image?: Blob | null;
            /**
             * Set to true to delete current image.
             */
            remove_image?: boolean | null;
        },
    ): CancelablePromise<{
        message?: string;
        data?: Product;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/products/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                403: `Access denied`,
            },
        });
    }
    /**
     * Delete product
     * @param id Product ID
     * @returns any Product deleted successfully
     * @throws ApiError
     */
    public static e80A6Ca46716Acee6B47Ea1Ac91663C0(
        id: number,
    ): CancelablePromise<{
        message?: string;
    }> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/products/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Access denied`,
                404: `Product not found`,
            },
        });
    }
    /**
     * Get vendor's products (Minimal Pagination) - Visible to Admin/Vendor
     * @param perPage Number of products per page.
     * @returns any Vendor's products list
     * @throws ApiError
     */
    public static e1Caf79623D4Afd8E2E296F0C244E580(
        perPage: number = 12,
    ): CancelablePromise<{
        message?: string;
        data?: Array<Product>;
        total?: number;
        per_page?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/vendor/my-products',
            query: {
                'per_page': perPage,
            },
            errors: {
                403: `Access denied. Vendor or Admin role required.`,
            },
        });
    }
    /**
     * Get product statistics (Admin/Vendor)
     * @returns any Vendor statistics
     * @throws ApiError
     */
    public static fc21D52Bf9442Ce22F18079D9C2056D(): CancelablePromise<{
        message?: string;
        data?: {
            total_products?: number;
            visible_products?: number;
            featured_products?: number;
            out_of_stock?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/vendor/stats',
            errors: {
                403: `Access denied. Admin or Vendor role required.`,
            },
        });
    }
    /**
     * Get a list of featured products (Public Access)
     * @param limit Maximum number of products to return.
     * @returns any Featured products retrieved successfully
     * @throws ApiError
     */
    public static a6D77F78200Bf3C67C5D5Cbc7A93A0Fa(
        limit: number = 8,
    ): CancelablePromise<{
        status?: string;
        data?: Array<Product>;
        message?: string;
        code?: number;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/products/featured',
            query: {
                'limit': limit,
            },
        });
    }
}
