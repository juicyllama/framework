import { Repository } from 'typeorm';
import { MollieCustomer } from './customer.entity';
import { Logger } from '@juicyllama/utils';
import { ConfigService } from '@nestjs/config';
import { Account, BaseService, Query } from '@juicyllama/core';
type T = MollieCustomer;
export declare class CustomerService extends BaseService<T> {
    readonly repository: Repository<T>;
    private readonly logger;
    readonly query: Query<T>;
    private readonly configService;
    constructor(repository: Repository<T>, logger: Logger, query: Query<T>, configService: ConfigService);
    create(account: Account): Promise<T>;
    findByAccount(account: Account): Promise<MollieCustomer>;
    remove(): Promise<T>;
}
export {};
