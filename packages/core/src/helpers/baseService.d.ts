import { Query } from '../utils/typeorm/Query';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { BeaconService } from '../modules/beacon/beacon.service';
import { Cache } from 'cache-manager';
import { CachePeriod } from '@juicyllama/utils';
import { ChartOptions } from '../utils/typeorm/types';
import { ResultSetHeader } from 'mysql2';
export declare class BaseService<T> {
    readonly query: Query<T>;
    readonly repository: Repository<T>;
    readonly options?: {
        beacon?: BeaconService;
        cache?: {
            cacheManager: Cache;
            field?: string;
            ttl?: CachePeriod;
        };
    };
    constructor(query: Query<T>, repository: Repository<T>, options?: {
        beacon?: BeaconService;
        cache?: {
            cacheManager: Cache;
            field?: string;
            ttl?: CachePeriod;
        };
    });
    create(data: DeepPartial<T>): Promise<T>;
    createMany(qty: number, data: DeepPartial<T>): Promise<T[]>;
    bulkInsert(data: DeepPartial<T>[]): Promise<ResultSetHeader>;
    findAll(options?: FindManyOptions): Promise<T[]>;
    findOne(options?: FindOneOptions): Promise<T>;
    findById(id: number, relations?: string[]): Promise<T>;
    count(options?: FindManyOptions): Promise<number>;
    sum(metric: string, options?: FindManyOptions): Promise<number>;
    avg(metric: string, options?: FindManyOptions): Promise<number>;
    charts(field: string, options?: ChartOptions): Promise<any>;
    update(data: DeepPartial<T>): Promise<T>;
    remove(record: T): Promise<T>;
    purge(record: T): Promise<void>;
    raw(sql: string): Promise<any>;
    sendBeacon(options: {
        action: 'CREATE' | 'UPDATE' | 'DELETE' | 'RELOAD';
        data: T;
    }): Promise<void>;
    getCacheKey(value: any): string;
    getCacheTTL(): CachePeriod;
    getCacheField(): string;
    cacheRecord(record: T): Promise<void>;
    cacheFindOne(options?: FindOneOptions): Promise<T>;
    cacheFindById(id: number): Promise<T>;
    cacheDelete(record: T): Promise<void>;
}
