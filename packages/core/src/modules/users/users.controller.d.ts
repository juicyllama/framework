/// <reference types="multer" />
import { ChartsPeriod, ChartsResponseDto, StatsMethods, StatsResponseDto } from '@juicyllama/utils';
import { CreateUserDto, UpdateUserDto } from './users.dto';
import { UserRole } from './users.enums';
import { AuthService } from '../auth/auth.service';
import { AccountService } from '../accounts/account.service';
import { UsersService } from './users.service';
import { Query as TQuery } from '../../utils/typeorm/Query';
import { T } from './users.constants';
import { CsvService } from '../csv/csv.service';
import { StorageService } from '../storage/storage.service';
import { CrudUploadCSVResponse } from '../../types/common';
export declare class UsersController {
    private readonly authService;
    private readonly accountService;
    private readonly tQuery;
    private readonly service;
    readonly storageService: StorageService;
    private readonly csvService;
    constructor(authService: AuthService, accountService: AccountService, tQuery: TQuery<T>, service: UsersService, storageService: StorageService, csvService: CsvService);
    create(req: any, account_id: number, data: CreateUserDto): Promise<T>;
    findAll(req: any, account_id: number, query: any): Promise<T[]>;
    stats(req: any, account_id: number, query: any, method?: StatsMethods): Promise<StatsResponseDto>;
    charts(req: any, query: any, search: string, from: string, to: string, fields: string[], period?: ChartsPeriod): Promise<ChartsResponseDto>;
    findOne(req: any, account_id: number, params: any, query: any): Promise<T>;
    update(req: any, account_id: number, data: UpdateUserDto, params: any): Promise<T>;
    uploadAvatarFile(req: any, file: Express.Multer.File, account_id: number, params: any): Promise<T>;
    uploadCSVFile(req: any, file: Express.Multer.File, account_id: number): Promise<CrudUploadCSVResponse>;
    update_role(req: any, account_id: number, params: any, role: UserRole): Promise<T>;
    remove(req: any, account_id: number, params: any): Promise<T>;
}
