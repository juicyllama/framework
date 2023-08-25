import { User } from '../../users/users.entity';
import { Account } from '../../accounts/account.entity';
import { BaseEntity } from '../../../helpers';
export declare class BeaconNotification extends BaseEntity {
    readonly notification_id: number;
    account: Account;
    users?: User[];
    subject: string;
    markdown: string;
    unique?: string;
    removed_at?: Date;
    removed_by: User;
    constructor(partial: Partial<BeaconNotification>);
}
