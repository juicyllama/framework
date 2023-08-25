import { Cache } from 'cache-manager';
export declare class CacheService {
    private cacheManager;
    constructor(cacheManager: Cache);
    clearCache(): Promise<void>;
}
