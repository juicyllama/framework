import { LoginResponseDto, ValidateCodeDto } from './dtos/login.dto';
import { CompletePasswordResetDto, InitiateResetPasswordDto } from './dtos/password.reset.dto';
import { User } from '../users/users.entity';
import { InitiatePasswordlessLoginDto } from './dtos/passwordless.login.dto';
import { AuthService } from './auth.service';
import { SuccessResponseDto } from '@juicyllama/utils';
import { UsersService } from '../users/users.service';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(req: any): Promise<LoginResponseDto>;
    getProfile(req: any): Promise<User>;
    initiatePasswordReset(req: any, data: InitiateResetPasswordDto): Promise<SuccessResponseDto>;
    validateVerificationCode(data: ValidateCodeDto): Promise<SuccessResponseDto>;
    completePasswordReset(data: CompletePasswordResetDto): Promise<LoginResponseDto>;
    initiatePasswordLessLogin(req: any, data: InitiatePasswordlessLoginDto): Promise<SuccessResponseDto>;
    validateCodeAndLogin(data: ValidateCodeDto): Promise<LoginResponseDto>;
    initiateGoogleLogin(): Promise<void>;
    googleAuthRedirect(req: any): Promise<LoginResponseDto>;
    initiateAzureLogin(): Promise<void>;
    azureAuthRedirect(req: any): Promise<LoginResponseDto>;
    accountCheck(req: any, account_id: number): Promise<{
        passed: boolean;
    }>;
}
