export declare class CompletePasswordResetDto {
    readonly email: string;
    readonly code: string;
    newPassword: string;
}
export declare class InitiateResetPasswordDto {
    readonly email: string;
}
