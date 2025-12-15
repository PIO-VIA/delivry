/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DashboardReportsService {
    /**
     * Get main Key Performance Indicators (KPIs)
     * @returns any KPIs retrieved successfully
     * @throws ApiError
     */
    public static e3Ffaa45376734Cb46F87E051250B1F5(): CancelablePromise<{
        message?: string;
        data?: {
            total_revenue?: number;
            total_orders?: number;
            new_orders_today?: number;
            active_users?: number;
            /**
             * Percentage of delivered orders
             */
            delivery_rate?: number;
            /**
             * Total delivered orders count
             */
            delivered_orders?: number;
            /**
             * Nombre de commandes en attente d'expédition.
             */
            orders_ready_to_ship?: number;
            /**
             * Nombre de commandes avec le statut IN_DELIVERY.
             */
            deliveries_in_progress?: number;
            /**
             * Nombre total de livraisons réussies.
             */
            deliveries_successful?: number;
            /**
             * Nombre total de livraisons échouées.
             */
            deliveries_failed?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/kpis',
        });
    }
    /**
     * Get sales volume and revenue trend over a period (e.g., last 30 days)
     * @param period Granularity of aggregation
     * @param days Number of days to look back
     * @returns any Sales data retrieved successfully
     * @throws ApiError
     */
    public static be25A5F67Ebff827E0969F2Cd3450Be7(
        period?: 'day' | 'week' | 'month',
        days: number = 30,
    ): CancelablePromise<{
        message?: string;
        data?: Array<{
            label?: string;
            revenue?: number;
            order_count?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/sales-over-time',
            query: {
                'period': period,
                'days': days,
            },
        });
    }
    /**
     * Get top selling products (quantity and revenue)
     * @param limit
     * @returns any Top products retrieved successfully
     * @throws ApiError
     */
    public static a834220D0866A8B323F4Adc395400(
        limit: number = 10,
    ): CancelablePromise<{
        message?: string;
        data?: Array<{
            product_name?: string;
            total_quantity?: number;
            total_revenue?: number;
        }>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/top-products',
            query: {
                'limit': limit,
            },
        });
    }
    /**
     * Get the count of orders by status for pie charts
     * @returns any Status distribution retrieved successfully
     * @throws ApiError
     */
    public static b4De423C6Cecc86E5A1Abb2E8A3E181A(): CancelablePromise<{
        message?: string;
        data?: {
            PENDING?: number;
            DELIVERED?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/dashboard/order-status-distribution',
        });
    }
}
