import { DeepPartial, Repository } from 'typeorm';
import { MollieMandate } from './mandate.entity';
import { Logger } from '@juicyllama/utils';
import { ConfigService } from '@nestjs/config';
import { BaseService, Query } from '@juicyllama/core';
import { CustomerService } from '../customer/customer.service';
type T = MollieMandate;
export declare class MandateService extends BaseService<T> {
    readonly repository: Repository<T>;
    private readonly logger;
    readonly query: Query<T>;
    private readonly customerService;
    private readonly configService;
    constructor(repository: Repository<T>, logger: Logger, query: Query<T>, customerService: CustomerService, configService: ConfigService);
    create(data: DeepPartial<T>): Promise<T>;
    syncMandate(mandate: T): Promise<T>;
    remove(): Promise<T>;
}
export {};
