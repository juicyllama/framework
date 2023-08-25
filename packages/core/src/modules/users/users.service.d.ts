import { Logger } from '@juicyllama/utils';
import { Repository } from 'typeorm';
import { AccountService } from '../accounts/account.service';
import { AuthService } from '../auth/auth.service';
import { BaseService } from '../../helpers/baseService';
import { StorageService } from '../storage/storage.service';
import { BeaconService } from '../beacon/beacon.service';
import { Query } from '../../utils/typeorm/Query';
import { Account } from '../accounts/account.entity';
import { UsersHooks } from './users.hooks';
import { CreateUserDto } from './users.dto';
import { T } from './users.constants';
export declare class UsersService extends BaseService<T> {
    readonly query: Query<T>;
    readonly repository: Repository<T>;
    readonly logger: Logger;
    readonly accountService: AccountService;
    readonly authService: AuthService;
    readonly beaconService: BeaconService;
    readonly storageService: StorageService;
    readonly usersHooks: UsersHooks;
    constructor(query: Query<T>, repository: Repository<T>, logger: Logger, accountService: AccountService, authService: AuthService, beaconService: BeaconService, storageService: StorageService, usersHooks: UsersHooks);
    create(data: Partial<T>): Promise<T>;
    invite(account: Account, newUser: CreateUserDto): Promise<T>;
    findOneByEmail(email: string): Promise<import("./users.entity").User>;
    update(data: Partial<T>): Promise<T>;
    uploadAvatar(user: any, file: any): Promise<T>;
    validateUser(email: any, pass: any): Promise<T>;
    validateEmail(email: any): Promise<T>;
    getValidatedUserByEmail(email: any): Promise<T>;
}
