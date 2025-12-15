/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Order } from '../models/Order';
import type { OrderResource } from '../models/OrderResource';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class OrdersService {
    /**
     * Get user's orders
     * @returns any Successful operation
     * @throws ApiError
     */
    public static cd7E03021E72D9D799C12Dfe179C865(): CancelablePromise<{
        data?: Array<Order>;
        links?: Record<string, any>;
        meta?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders',
        });
    }
    /**
     * Create a new order
     * @param requestBody
     * @returns any Order created successfully
     * @throws ApiError
     */
    public static d690D6834318E9B064Df441E854De8B9(
        requestBody: {
            customer_name: string;
            customer_email: string;
            customer_phone: string;
            shipping_address: string;
            shipping_city: string;
            shipping_zipcode: string;
            shipping_country: string;
            billing_address?: string;
            billing_city?: string;
            billing_zipcode?: string;
            billing_country?: string;
            payment_method: string;
            notes?: string;
        },
    ): CancelablePromise<{
        message?: string;
        order?: Order;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/orders',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation error`,
            },
        });
    }
    /**
     * Update the status of a specific order (Management Only)
     * @param order ID of the order to update
     * @param requestBody
     * @returns any Order status updated successfully
     * @throws ApiError
     */
    public static ca851Ecbdeb079209Abac2E00C4A6359(
        order: number,
        requestBody: {
            /**
             * New status for the order
             */
            status?: 'PENDING' | 'PROCESSING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELED' | 'FAILED' | 'IN_DELIVERY';
        },
    ): CancelablePromise<{
        message?: string;
        data?: Order;
    }> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/orders/{order}/status',
            path: {
                'order': order,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                403: `Forbidden - Only management roles can update status`,
                404: `Order not found`,
                422: `Validation error`,
            },
        });
    }
    /**
     * Get order details
     * @param id Order ID
     * @returns Order Successful operation
     * @throws ApiError
     */
    public static c29621029E70F65247909D3E09031118(
        id: number,
    ): CancelablePromise<Order> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/{id}',
            path: {
                'id': id,
            },
            errors: {
                403: `Unauthorized`,
                404: `Order not found`,
            },
        });
    }
    /**
     * Get list of orders for the authenticated user (Client Only)
     * @param status Filter by order status
     * @returns any User's orders retrieved successfully
     * @throws ApiError
     */
    public static bbe2Ec3088F531Fcb7Cb01B1B2C8Fa89(
        status?: string,
    ): CancelablePromise<{
        data?: Array<OrderResource>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/orders/my',
            query: {
                'status': status,
            },
            errors: {
                401: `Unauthenticated`,
                404: `No orders found`,
            },
        });
    }
}
