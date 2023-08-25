import { UsersService } from '../../users/users.service';
declare const MicrosoftStrategy_base: new (...args: any[]) => any;
export declare class MicrosoftStrategy extends MicrosoftStrategy_base {
    private usersService;
    constructor(usersService: UsersService);
    validate(accessToken: string, refreshToken: string, profile: any): Promise<any>;
}
export {};
