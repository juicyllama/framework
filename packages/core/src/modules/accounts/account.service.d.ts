/// <reference types="multer" />
import { BeaconService } from '../beacon/beacon.service';
import { Account } from './account.entity';
import { Logger } from '@juicyllama/utils';
import { BaseService } from '../../helpers/baseService';
import { DeepPartial, Repository } from 'typeorm';
import { Query } from '../../utils/typeorm/Query';
import { StorageService } from '../storage/storage.service';
import { AuthService } from '../auth/auth.service';
import { UsersService } from '../users/users.service';
import { OnboardAccountDto, OnboardAdditionalAccountDto, SuccessAccountDto } from './account.dto';
import { AccountHooks } from './account.hooks';
import { User } from '../users/users.entity';
type T = Account;
export declare class AccountService extends BaseService<T> {
    readonly query: Query<T>;
    readonly repository: Repository<T>;
    readonly logger: Logger;
    readonly authService: AuthService;
    readonly beaconService: BeaconService;
    readonly storageService: StorageService;
    readonly usersService: UsersService;
    readonly accountHooks: AccountHooks;
    constructor(query: Query<T>, repository: Repository<T>, logger: Logger, authService: AuthService, beaconService: BeaconService, storageService: StorageService, usersService: UsersService, accountHooks: AccountHooks);
    create(data: DeepPartial<T>): Promise<T>;
    onboard(data: OnboardAccountDto): Promise<SuccessAccountDto>;
    onboardAdditional(user: User, data: OnboardAdditionalAccountDto): Promise<SuccessAccountDto>;
    uploadAvatar(account: T, file: Express.Multer.File): Promise<T>;
    transfer(account: any, old_owner: any, new_owner: any): Promise<boolean>;
    getOwner(account: any): Promise<User>;
    remove(account: T): Promise<T>;
}
export {};
