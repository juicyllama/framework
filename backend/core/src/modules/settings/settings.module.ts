import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Query } from '../../utils/typeorm/Query'
import { SettingsController } from './settings.controller'
import { Setting } from './settings.entity'
import { SettingsService } from './settings.service'

@Module({
	imports: [TypeOrmModule.forFeature([Setting])],
	controllers: [SettingsController],
	providers: [SettingsService, Logger, Query],
	exports: [SettingsService],
})
export class SettingsModule {}
