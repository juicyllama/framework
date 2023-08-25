import { DeepPartial, FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import _ from 'lodash';
import { ChartOptions } from './types';
import { ResultSetHeader } from 'mysql2';
export declare class Query<T> {
    raw(repository: Repository<T>, sql: string): Promise<any>;
    create(repository: Repository<T>, data: DeepPartial<T>): Promise<T>;
    bulkInsert(repository: Repository<T>, data: DeepPartial<T>[]): Promise<ResultSetHeader>;
    findOneById(repository: Repository<T>, id: number, relations?: string[]): Promise<T>;
    findOneByWhere(repository: Repository<T>, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>, options?: FindManyOptions): Promise<T>;
    findOne(repository: Repository<T>, options?: FindOneOptions): Promise<T>;
    findAll(repository: Repository<T>, options?: FindManyOptions): Promise<T[]>;
    update(repository: Repository<T>, data: DeepPartial<T>): Promise<T>;
    count(repository: Repository<T>, options?: FindManyOptions): Promise<number>;
    sum(repository: Repository<T>, metric: string, options?: FindManyOptions): Promise<number>;
    avg(repository: Repository<T>, metric: string, options?: FindManyOptions): Promise<number>;
    charts(repository: Repository<T>, field: string, options: ChartOptions): Promise<any>;
    remove(repository: Repository<T>, record: T): Promise<T>;
    purge(repository: Repository<T>, record: T): Promise<void>;
    getPrimaryKey(repository: Repository<T>): string;
    getTableName(repository: Repository<T>): string;
    getRelations(repository: Repository<T>): {};
    getEventName(repository: Repository<T>, result: T): string;
    private mapComparisonOperatorToTypeORMFindOperators;
    buildWhere(options: {
        repository: Repository<T>;
        query?: any;
        account_id?: number;
        account_ids?: number[];
        search_fields?: string[];
    }): FindOptionsWhere<T>[] | FindOptionsWhere<T>;
    findOneOptions(query: {
        select?: any;
        relations?: any;
    }, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>): _.Dictionary<any>;
    findOptions(query: {
        select?: any;
        relations?: any;
        limit?: number;
        offset?: number;
        order_by?: string;
        order_by_type?: string;
    }, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>, fallback_order_column?: string): FindManyOptions<T>;
    getUniqueKeyFields(repository: Repository<T>): string[];
    handleCreateError(e: any, repository: Repository<T>, data: DeepPartial<T>): Promise<T>;
    handleUpdateError(e: any, repository: Repository<T>, data: DeepPartial<T>): Promise<T>;
}
