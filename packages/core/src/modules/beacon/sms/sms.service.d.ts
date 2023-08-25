import { BeaconMessageDto } from '../beacon.dto';
import { DeepPartial, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@juicyllama/utils';
import { LazyModuleLoader } from '@nestjs/core';
import { Query } from '../../../utils/typeorm/Query';
import { BeaconSms } from './sms.entity';
export declare class BeaconSmsService {
    private readonly query;
    private readonly repository;
    private readonly configService;
    private readonly logger;
    private readonly lazyModuleLoader;
    constructor(query: Query<BeaconSms>, repository: Repository<BeaconSms>, configService: ConfigService, logger: Logger, lazyModuleLoader: LazyModuleLoader);
    create(message: BeaconMessageDto): Promise<boolean>;
    update(data: DeepPartial<BeaconSms>): Promise<BeaconSms>;
}
