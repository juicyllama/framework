import {
	AuthModule,
	BeaconModule,
	ConfigValidationModule,
	Query,
	SettingsModule,
	StorageModule,
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WebsitesConfigDto } from '../../config/websites.config.dto'
import { WebsitesController } from './websites.controller'
import { WebsitesCronsController } from './websites.cron.controller'
import { WebsitesCronsService } from './websites.crons.service'
import { Website } from './websites.entity'
import { WebsitesService } from './websites.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Website]),
		ConfigValidationModule.register(WebsitesConfigDto),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => SettingsModule),
		forwardRef(() => StorageModule),
	],
	controllers: [WebsitesController, WebsitesCronsController],
	providers: [WebsitesService, WebsitesCronsService, Logger, Query],
	exports: [WebsitesService],
})
export class WebsitesModule {}
