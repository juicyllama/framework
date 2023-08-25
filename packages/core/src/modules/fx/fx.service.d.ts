import { Repository } from 'typeorm';
import { FxRate } from './fx.entity';
import { Cache } from 'cache-manager';
import { Logger, SupportedCurrencies } from '@juicyllama/utils';
import { Query } from '../../utils/typeorm/Query';
export declare class FxService {
    private readonly query;
    private readonly repository;
    private readonly logger;
    private cacheManager;
    constructor(query: Query<FxRate>, repository: Repository<FxRate>, logger: Logger, cacheManager: Cache);
    convert(amount: number, from: SupportedCurrencies, to: SupportedCurrencies, date?: Date): Promise<number>;
}
