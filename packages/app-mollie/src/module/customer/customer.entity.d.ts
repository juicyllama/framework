import { Account, BaseEntity } from '@juicyllama/core';
export declare class MollieCustomer extends BaseEntity {
    readonly mollie_customer_id: number;
    ext_customer_id: string;
    account: Account;
    last_check_at?: Date;
    next_check_at?: Date;
    constructor(partial: Partial<MollieCustomer>);
}
