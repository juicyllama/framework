import { MollieCustomer } from '../customer/customer.entity';
import { MandateMethod, MandateStatus } from '@mollie/api-client';
import { MandateDetails } from '@mollie/api-client/dist/types/src/data/customers/mandates/data';
import { BaseEntity } from '@juicyllama/core';
export declare class MollieMandate extends BaseEntity {
    readonly mollie_mandate_id: number;
    ext_mandate_id: string;
    status?: MandateStatus;
    method?: MandateMethod;
    details?: MandateDetails;
    customer: MollieCustomer;
    last_check_at?: Date;
    next_check_at?: Date;
    constructor(partial: Partial<MollieMandate>);
}
