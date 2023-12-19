import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { WebsitesService } from './websites.service'
import { WebsitesController } from './websites.controller'
import {
	Account,
	AuthModule,
	BeaconModule,
	Query,
	SettingsModule,
	StorageModule,
} from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Website } from './websites.entity'
import { WebsitesCronsController } from './websites.cron.controller'
import { WebsitesCronsService } from './websites.crons.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Website, Account]),
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
