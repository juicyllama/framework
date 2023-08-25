import { UserRole } from '../../users/users.enums';
export declare class AuthDto {
    readonly user_id: number;
    readonly email: string;
    readonly role?: UserRole;
}
