export declare class UserDto {
    user_id?: number;
    first_name?: string;
    last_name?: string;
    email: string;
    password?: string;
    password_reset?: boolean;
}
export declare class CreateUserDto extends UserDto {
}
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
}
export {};
