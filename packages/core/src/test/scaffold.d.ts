import { TestingModule } from '@nestjs/testing';
import { HttpServer } from '@nestjs/common';
import { AccountService } from '../modules/accounts/account.service';
import { Account } from '../modules/accounts/account.entity';
import { User } from '../modules/users/users.entity';
import { Logger } from '@juicyllama/utils';
import { AuthService } from '../modules/auth/auth.service';
import { Query } from '../utils/typeorm/Query';
import { DeepPartial, Repository } from 'typeorm';
export declare class ScaffoldDto<T> {
    server: HttpServer;
    module: TestingModule;
    query: Query<T>;
    repository: Repository<T>;
    services: {
        accountService: AccountService;
        authService: AuthService;
        logger: Logger;
        service: any;
    };
    values: {
        account: Account;
        owner: User;
        owner_access_token: string;
        owner_password: string;
        record: T;
        mock: DeepPartial<T>;
    };
}
export declare class Scaffold<T> {
    up(MODULE?: any, SERVICE?: any): Promise<ScaffoldDto<T>>;
    down(E?: any): Promise<void>;
}
