import { Repository } from 'typeorm';
import { Setting } from './settings.entity';
import { Cache } from 'cache-manager';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CachePeriod, Logger } from '@juicyllama/utils';
import { Query } from '../../utils/typeorm/Query';
export declare class SettingsService {
    private readonly query;
    private readonly repository;
    private cacheManager;
    private logger;
    constructor(query: Query<Setting>, repository: Repository<Setting>, cacheManager: Cache, logger: Logger);
    create(key: string, value: any): Promise<Setting>;
    findOne(key: string): Promise<Setting>;
    findAll(options?: FindManyOptions): Promise<Setting[]>;
    findValue(key: string): Promise<any>;
    update(key: string, value: any): Promise<Setting>;
    purge(setting: Setting): Promise<void>;
    cronCheck(domain: string, time: CachePeriod): Promise<boolean>;
    cronEnd(domain: string): Promise<void>;
    static validate(value: any): boolean;
}
