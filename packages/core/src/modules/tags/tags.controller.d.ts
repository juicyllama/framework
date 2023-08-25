import { StatsMethods, StatsResponseDto } from '@juicyllama/utils';
import { Tag } from './tags.entity';
import { TagsService } from './tags.service';
import { Query as TQuery } from '../../utils/typeorm/Query';
import { CreateTagDto, UpdateTagDto } from './tags.dtos';
type T = Tag;
export declare class TagsController {
    private readonly service;
    private readonly tQuery;
    constructor(service: TagsService, tQuery: TQuery<T>);
    create(data: CreateTagDto): Promise<T>;
    findAll(req: any, query: any): Promise<T[]>;
    stats(req: any, query: any, method?: StatsMethods): Promise<StatsResponseDto>;
    findOne(req: any, params: any, query: any): Promise<T>;
    update(req: any, data: UpdateTagDto, account_id: number, params: any): Promise<T>;
    remove(req: any, account_id: number, params: any): Promise<void>;
}
export {};
