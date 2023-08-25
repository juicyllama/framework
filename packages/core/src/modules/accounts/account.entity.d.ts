import { BaseEntity } from '../../helpers/baseEntity';
import { SupportedCurrencies } from '@juicyllama/utils';
import { Tag } from '../tags/tags.entity';
import { Role } from '../auth/role.entity';
export declare class Account extends BaseEntity {
    readonly account_id: number;
    account_name: string;
    currency: SupportedCurrencies;
    company_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
    finance_email?: string;
    customer_service_email?: string;
    avatar_image_url?: string;
    onboarding_step?: number;
    onboarding_complete?: boolean;
    tags?: Tag[];
    roles?: Role[];
    constructor(partial: Partial<Account>);
}
