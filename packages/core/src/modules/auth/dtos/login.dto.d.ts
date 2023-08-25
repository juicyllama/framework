export declare class LoginResponseDto {
    access_token: string;
    constructor(token: string);
}
export declare class LoginRequestDto {
    readonly email: string;
    readonly password: string;
}
export declare class ValidateCodeDto {
    readonly code: string;
}
