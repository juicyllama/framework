import { BeaconMessageDto } from '../beacon.dto';
import { BeaconEmail } from './email.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@juicyllama/utils';
import { LazyModuleLoader } from '@nestjs/core';
import { Query } from '../../../utils/typeorm/Query';
export declare class BeaconEmailService {
    private readonly query;
    private readonly repository;
    private readonly configService;
    private readonly logger;
    private readonly lazyModuleLoader;
    constructor(query: Query<BeaconEmail>, repository: Repository<BeaconEmail>, configService: ConfigService, logger: Logger, lazyModuleLoader: LazyModuleLoader);
    create(message: BeaconMessageDto): Promise<boolean>;
    update(email_id: number, data: DeepPartial<BeaconEmail>): Promise<BeaconEmail>;
}
