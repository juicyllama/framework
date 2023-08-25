import { BeaconService } from '../beacon/beacon.service';
import { Account } from './account.entity';
import { User } from '../users/users.entity';
export declare class AccountHooks {
    private readonly beaconService;
    constructor(beaconService: BeaconService);
    Created(account: Account, owner: User): Promise<void>;
}
