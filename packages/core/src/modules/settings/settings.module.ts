import { Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsService } from './settings.service'
import { Setting } from './settings.entity'
import { Logger } from '@juicyllama/utils'
import { databaseConfig } from '../../configs'
import cacheConfig from '../../configs/cache.config'
import { ConfigModule } from '@nestjs/config'
import { Query } from '../../utils/typeorm/Query'

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
