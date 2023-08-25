import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Tag } from './tags.entity';
import { Cache } from 'cache-manager';
import { Query } from '../../utils/typeorm/Query';
type T = Tag;
export declare class TagsService {
    private readonly query;
    readonly repository: Repository<T>;
    private cacheManager;
    constructor(query: Query<T>, repository: Repository<T>, cacheManager: Cache);
    createFromStrings(tags: string[]): Promise<T[]>;
    create(name: string): Promise<T>;
    findAll(options?: FindManyOptions): Promise<T[]>;
    findOne(options?: FindOneOptions): Promise<T>;
    findById(id: number, relations?: string[]): Promise<T>;
    findUnused(): Promise<T[]>;
    findByName(name: string): Promise<T>;
    count(options?: FindManyOptions): Promise<number>;
    update(data: DeepPartial<T>): Promise<T>;
    purge(tag: T): Promise<void>;
}
export {};
