import { SupportedCurrencies } from '@juicyllama/utils';
import { Account } from './account.entity';
import { User } from '../users/users.entity';
export declare class SuccessAccountDto {
    readonly account: Account;
    readonly owner: User;
}
export declare class OnboardAccountDto {
    account_id?: number;
    account_name: string;
    owners_email: string;
    owners_password?: string;
    owners_first_name?: string;
    owners_last_name?: string;
    currency?: SupportedCurrencies;
}
export declare class OnboardAdditionalAccountDto {
    account_name: string;
    currency?: SupportedCurrencies;
}
export declare class AccountDto {
    account_id: number;
    account_name: string;
    currency?: SupportedCurrencies;
    company_name?: string;
    address_1?: string;
    address_2?: string;
    city?: string;
    postcode?: string;
    state?: string;
    country?: string;
    finance_email?: string;
}
export declare class CreateAccountDto extends AccountDto {
}
declare const UpdateAccountDto_base: import("@nestjs/common").Type<Partial<AccountDto>>;
export declare class UpdateAccountDto extends UpdateAccountDto_base {
}
export {};
