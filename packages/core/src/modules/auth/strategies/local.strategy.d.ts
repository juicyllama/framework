import { Strategy } from 'passport-local';
import { Logger } from '@juicyllama/utils';
import { UsersService } from '../../users/users.service';
declare const LocalStrategy_base: new (...args: any[]) => Strategy;
export declare class LocalStrategy extends LocalStrategy_base {
    private usersService;
    private logger;
    constructor(usersService: UsersService, logger: Logger);
    validate(email: string, pass: string): Promise<any>;
}
export {};
