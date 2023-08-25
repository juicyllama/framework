import { CacheModule, Module } from '@nestjs/common'
import { StorageService } from './storage.service'
import { Logger } from '@juicyllama/utils'
import cacheConfig from '../../configs/cache.config'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query'

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
