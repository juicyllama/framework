import { ConfigService } from '@nestjs/config';
import { BeaconService } from '../beacon/beacon.service';
export declare class UsersHooks {
    private readonly configService;
    private readonly beaconService;
    constructor(configService: ConfigService, beaconService: BeaconService);
    invited(account: any, user: any): Promise<void>;
    account_added(account: any, user: any): Promise<void>;
}
