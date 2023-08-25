import { NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { Logger } from '@juicyllama/utils';
import { AuthService } from '../modules/auth/auth.service';
import { AccountService } from '../modules/accounts/account.service';
export declare class MiddlewareAccountId implements NestMiddleware {
    private readonly accountService;
    private readonly authService;
    private readonly logger;
    constructor(accountService: AccountService, authService: AuthService, logger: Logger);
    use(req: any, res: any, next: NextFunction): Promise<void>;
}
