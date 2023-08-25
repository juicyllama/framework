import { BeaconMessageDto } from '../beacon.dto';
import { BeaconPush } from './push.entity';
import { Repository } from 'typeorm';
import { Logger } from '@juicyllama/utils';
import { ConfigService } from '@nestjs/config';
import { Query } from '../../../utils/typeorm/Query';
export declare class BeaconPushService {
    private readonly query;
    private readonly repository;
    private readonly logger;
    private readonly configService;
    constructor(query: Query<BeaconPush>, repository: Repository<BeaconPush>, logger: Logger, configService: ConfigService);
    create(message: BeaconMessageDto): Promise<boolean>;
}
