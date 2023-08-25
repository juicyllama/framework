import { BeaconNotification } from './notification.entity';
import { Repository } from 'typeorm';
import { Query } from '../../../utils/typeorm/Query';
import { BaseService } from '../../../helpers';
import { BeaconMessageDto } from '../beacon.dto';
import { Logger } from '@juicyllama/utils';
import { UsersService } from '../../users/users.service';
import { BeaconPushService } from '../push/push.service';
import { AuthService } from '../../auth/auth.service';
type T = BeaconNotification;
export declare class BeaconNotificationService extends BaseService<T> {
    readonly query: Query<T>;
    readonly repository: Repository<T>;
    private readonly logger;
    private readonly beaconPushService;
    private readonly authService;
    private readonly usersService;
    constructor(query: Query<T>, repository: Repository<T>, logger: Logger, beaconPushService: BeaconPushService, authService: AuthService, usersService: UsersService);
    create(message: BeaconMessageDto): Promise<T>;
}
export {};
