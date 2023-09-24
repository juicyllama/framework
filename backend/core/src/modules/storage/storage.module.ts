import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { StorageService } from './storage.service.js'
import { Logger } from '@juicyllama/utils'
import cacheConfig from '../../configs/cache.config.js'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query.js'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
	],
	providers: [StorageService, Logger, Query],
	exports: [StorageService],
})
export class StorageModule {}
