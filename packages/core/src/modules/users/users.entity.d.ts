import { BaseEntity } from '../../helpers/baseEntity';
import { Account } from '../accounts/account.entity';
import { UserAvatarType } from './users.enums';
import { Role } from '../auth/role.entity';
export declare class User extends BaseEntity {
    readonly user_id: number;
    first_name?: string;
    last_name?: string;
    readonly email: string;
    password?: string;
    password_reset?: boolean;
    avatar_type: UserAvatarType;
    avatar_image_url?: string;
    last_login_at?: Date;
    accounts?: Account[];
    roles?: Role[];
    constructor(partial: Partial<User>);
}
