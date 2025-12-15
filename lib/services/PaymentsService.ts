/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PaymentsService {
    /**
     * Create a Stripe PaymentIntent and local payment record
     * @param orderId ID of the order linked to this payment
     * @param requestBody
     * @returns any PaymentIntent created
     * @throws ApiError
     */
    public static e90C50D0903F6A87Baf44A1212373499(
        orderId: number,
        requestBody: {
            amount: number;
            paymentMethod: string;
        },
    ): CancelablePromise<{
        clientSecret?: string;
        payment?: Record<string, any>;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/create-payment-intent/order/{orderId}',
            path: {
                'orderId': orderId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Register the transaction id of a payment
     * @param requestBody
     * @returns string Payment completed successfully
     * @throws ApiError
     */
    public static c010E1A7B269B2E9Ba9601989560Da(
        requestBody: {
            paymentId: number;
            transactionId: string;
        },
    ): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/payment/registerPayment',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Payment not found`,
            },
        });
    }
}
