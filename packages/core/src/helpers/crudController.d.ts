/// <reference types="multer" />
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils';
import { Query as TQuery } from '../utils/typeorm/Query';
import { CsvService } from '../modules/csv/csv.service';
import { CrudUploadCSVResponse } from '../types/common';
export declare function crudCreate<T>(options: {
    service: any;
    data: any;
}): Promise<T>;
export declare function crudFindAll<T>(options: {
    service: any;
    tQuery: TQuery<T>;
    account_id?: number;
    query: any;
    searchFields?: string[];
    order_by?: string;
}): Promise<T[]>;
export declare function crudFindOne<T>(options: {
    service: any;
    query: any;
    primaryKey: number;
    account_id?: number;
}): Promise<T>;
export declare function crudStats<T>(options: {
    service: any;
    tQuery: TQuery<T>;
    account_id?: number;
    query: any;
    method?: StatsMethods;
    searchFields: string[];
}): Promise<StatsResponseDto>;
export declare function crudCharts<T>(options: {
    service: any;
    tQuery: TQuery<T>;
    query: any;
    account_id?: number;
    search: string;
    period?: ChartsPeriod;
    from?: Date;
    to?: Date;
    fields: string[];
    searchFields: string[];
}): Promise<ChartsResponseDto>;
export declare function crudUpdate<T>(options: {
    service: any;
    data: any;
    primaryKey: number;
    account_id?: number;
}): Promise<T>;
export declare function crudUploadCSV<T>(file: Express.Multer.File, mappers: string[], options: {
    skip_first?: boolean;
    service: any;
    csvService: CsvService;
    account_id?: number;
}): Promise<CrudUploadCSVResponse>;
export declare function crudDelete<T>(options: {
    service: any;
    primaryKey: number;
    account_id?: number;
}): Promise<T>;
export declare function crudPurge<T>(options: {
    service: any;
    primaryKey: number;
    account_id?: number;
}): Promise<T>;
