import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsService } from './settings.service'
import { Setting } from './settings.entity'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query'
import { SettingsController } from './settings.controller'
import { CacheModule } from '@nestjs/cache-manager'
import cacheConfig from '../../configs/cache.config'

@Module({
	imports: [CacheModule.registerAsync(cacheConfig()), TypeOrmModule.forFeature([Setting])],
	controllers: [SettingsController],
	providers: [SettingsService, Logger, Query],
	exports: [SettingsService],
})
export class SettingsModule {}
