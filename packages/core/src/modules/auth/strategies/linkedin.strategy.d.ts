import { UsersService } from '../../users/users.service';
declare const LinkedinStrategy_base: new (...args: any[]) => any;
export declare class LinkedinStrategy extends LinkedinStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
