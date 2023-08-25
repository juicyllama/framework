import { Account } from '../modules/accounts/account.entity';
import { DeepPartial } from 'typeorm';
import { ScaffoldDto } from './scaffold';
import { METHOD } from '../types';
export declare function TestEndpoint<T>(options: {
    type: METHOD;
    scaffold: ScaffoldDto<T>;
    url: string;
    PRIMARY_KEY?: string;
    data?: Partial<T> | DeepPartial<T>;
    attach?: {
        field: string;
        file: any;
    };
    queryParams?: {
        [key: string]: any;
    };
    primaryKey?: number;
    access_token?: string;
    account?: Account;
    emitCheckResultKeys?: string[];
    skipResultCheck?: boolean;
}): Promise<T>;
export declare function TestService<T>(options: {
    type: METHOD;
    scaffold: ScaffoldDto<T>;
    mock?: DeepPartial<T>;
    PRIMARY_KEY?: string;
    record?: T;
}): Promise<T>;
