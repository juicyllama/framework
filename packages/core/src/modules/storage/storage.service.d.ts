import { Cache } from 'cache-manager';
import { Logger } from '@juicyllama/utils';
import { StorageFileFormat, StorageFileType } from './storage.enums';
import { LazyModuleLoader } from '@nestjs/core';
export declare class StorageService {
    private readonly logger;
    private cacheManager;
    private readonly lazyModuleLoader;
    constructor(logger: Logger, cacheManager: Cache, lazyModuleLoader: LazyModuleLoader);
    write(location: string, permissions: StorageFileType, format: StorageFileFormat, file: any): Promise<any>;
    list(location: string, permissions: StorageFileType): Promise<any>;
    read(location: string, permissions: StorageFileType, format?: StorageFileFormat): Promise<any>;
    del(location: string, permissions: StorageFileType): Promise<any>;
}
