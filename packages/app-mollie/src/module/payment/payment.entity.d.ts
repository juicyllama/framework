import { MollieCustomer } from '../customer/customer.entity';
import { MollieMandate } from '../mandate/mandate.entity';
import { SupportedCurrencies } from '@juicyllama/utils';
import { PaymentMethod, PaymentStatus } from '@mollie/api-client';
import { BaseEntity } from '@juicyllama/core';
export declare class MolliePayment extends BaseEntity {
    readonly mollie_payment_id: number;
    ext_payment_id?: string;
    status: PaymentStatus;
    amount: number;
    currency: SupportedCurrencies;
    method: PaymentMethod;
    customer?: MollieCustomer;
    mandate?: MollieMandate;
    last_check_at?: Date;
    next_check_at?: Date;
    constructor(partial: Partial<MolliePayment>);
}
