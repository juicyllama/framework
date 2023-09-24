import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsService } from './settings.service.js'
import { Setting } from './settings.entity.js'
import { Logger } from '@juicyllama/utils'
import { databaseConfig } from '../../configs/index.js'
import cacheConfig from '../../configs/cache.config.js'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query.js'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig, databaseConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Setting]),
	],
	controllers: [],
	providers: [SettingsService, Logger, Query],
	exports: [SettingsService],
})
export class SettingsModule {}
