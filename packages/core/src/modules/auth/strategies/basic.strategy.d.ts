import { BasicStrategy as Strategy } from 'passport-http';
import { UsersService } from '../../users/users.service';
declare const BasicStrategy_base: new (...args: any[]) => Strategy;
export declare class BasicStrategy extends BasicStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(req: Request, email: string, pass: string): Promise<any>;
}
export {};
