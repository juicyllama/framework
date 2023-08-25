import { Account } from '../modules/accounts/account.entity';
import { User } from '../modules/users/users.entity';
export declare function MockAccountRequest(password?: string): {
    account_name: string;
    owners_email: string;
    owners_password: string;
    owners_first_name: string;
    owners_last_name: string;
};
export declare function MockUserRequest(account: Account): Partial<User>;
