import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SettingsService } from './settings.service.js'
import { Setting } from './settings.entity.js'
import { Logger } from '@juicyllama/utils'
import { Query } from '../../utils/typeorm/Query.js'
import { SettingsController } from './settings.controller.js'
import { CacheModule } from '@nestjs/cache-manager'
import cacheConfig from '../../configs/cache.config.js'

@Module({
	imports: [CacheModule.registerAsync(cacheConfig()), TypeOrmModule.forFeature([Setting])],
	controllers: [SettingsController],
	providers: [SettingsService, Logger, Query],
	exports: [SettingsService],
})
export class SettingsModule {}
