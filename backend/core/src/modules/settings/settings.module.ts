import { Logger } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import cacheConfig from '../../configs/cache.config'
import { Query } from '../../utils/typeorm/Query'
import { SettingsController } from './settings.controller'
import { Setting } from './settings.entity'
import { SettingsService } from './settings.service'

@Module({
	imports: [CacheModule.registerAsync(cacheConfig()), TypeOrmModule.forFeature([Setting])],
	controllers: [SettingsController],
	providers: [SettingsService, Logger, Query],
	exports: [SettingsService],
})
export class SettingsModule {}
