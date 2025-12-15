/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OrderItemResource } from './OrderItemResource';
/**
 * Structure de données pour une commande retournée par l'API (inclut les relations items)
 */
export type OrderResource = {
    id?: number;
    order_number?: string;
    status?: OrderResource.status;
    total?: number;
    customer_email?: string;
    shipping_city?: string;
    created_at?: string;
    /**
     * Articles inclus dans la commande
     */
    items?: Array<OrderItemResource>;
};
export namespace OrderResource {
    export enum status {
        PENDING = 'PENDING',
        PROCESSING = 'PROCESSING',
        PAID = 'PAID',
        SHIPPED = 'SHIPPED',
        DELIVERED = 'DELIVERED',
        CANCELED = 'CANCELED',
        FAILED = 'FAILED',
        IN_DELIVERY = 'IN_DELIVERY',
    }
}

