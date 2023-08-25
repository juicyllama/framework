import { BaseEntity } from '../../helpers/baseEntity';
import { Account } from '../accounts/account.entity';
import { User } from '../users/users.entity';
import { UserRole } from '../users/users.enums';
export declare class Role extends BaseEntity {
    readonly role_id: number;
    user: User;
    user_id?: number;
    account: Account;
    account_id?: number;
    role: UserRole;
    constructor(partial: Partial<User>);
}
