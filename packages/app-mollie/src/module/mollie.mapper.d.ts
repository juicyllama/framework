import * as Mollie from '@mollie/api-client';
import { PaymentStatus } from '@juicyllama/billing';
export declare function molliePaymentStatus(status: Mollie.PaymentStatus): PaymentStatus;
