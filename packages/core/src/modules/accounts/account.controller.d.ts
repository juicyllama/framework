/// <reference types="multer" />
import { StatsMethods, StatsResponseDto, SuccessResponseDto } from '@juicyllama/utils';
import { AuthService } from '../auth/auth.service';
import { AccountService } from './account.service';
import { OnboardAccountDto, OnboardAdditionalAccountDto, SuccessAccountDto, UpdateAccountDto } from './account.dto';
import { Account } from './account.entity';
import { Query as TQuery } from '../../utils/typeorm/Query';
import { UsersService } from '../users/users.service';
type T = Account;
export declare class AccountController {
    private readonly authService;
    private readonly service;
    private readonly tQuery;
    private readonly usersService;
    constructor(authService: AuthService, service: AccountService, tQuery: TQuery<T>, usersService: UsersService);
    create(data: OnboardAccountDto): Promise<SuccessAccountDto>;
    createAdditionalAccount(req: any, data: OnboardAdditionalAccountDto): Promise<SuccessAccountDto>;
    findAll(req: any, query: any): Promise<T[]>;
    stats(req: any, query: any, method?: StatsMethods): Promise<StatsResponseDto>;
    findOne(req: any, params: any, query: any): Promise<T>;
    update(req: any, data: UpdateAccountDto, account_id: number): Promise<T>;
    uploadAvatarFile(req: any, file: Express.Multer.File, account_id: number): Promise<T>;
    transfer(req: any, account_id: number, user_id: number): Promise<SuccessResponseDto>;
    close(req: any, account_id: number): Promise<T>;
}
export {};
