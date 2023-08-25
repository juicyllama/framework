import { Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';
export declare class TypeOrm {
    static findOptions<T>(query: any, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>, default_sort: string): FindManyOptions<T>;
    static findOneOptions<T>(query: any, where: FindOptionsWhere<T>[] | FindOptionsWhere<T>): FindOneOptions<T>;
    static findAllOptionsWrapper<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions;
    static findOneOptionsWrapper<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions;
    static filterOutInvalidSelectValues<T>(repository: Repository<T>, options: FindManyOptions): FindManyOptions;
    static handleEmptyOptions<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions<any>;
    static handleEmptyWhere<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions<any>;
    static handleEmptyRelations<T>(repository: Repository<T>, options?: FindManyOptions): FindManyOptions<any>;
    static getPrimaryKey<T>(repository: Repository<T>): string;
}
