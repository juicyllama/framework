import { AuthModule, BeaconModule, Query, SettingsModule, StorageModule } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import websitesConfig from '../../config/websites.config'
import { WebsitesController } from './websites.controller'
import { WebsitesCronsController } from './websites.cron.controller'
import { WebsitesCronsService } from './websites.crons.service'
import { Website } from './websites.entity'
import { WebsitesService } from './websites.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Website]),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [websitesConfig],
		}),
		AuthModule,
		BeaconModule,
		SettingsModule,
		StorageModule,
	],
	controllers: [WebsitesController, WebsitesCronsController],
	providers: [WebsitesService, WebsitesCronsService, Logger, Query],
	exports: [WebsitesService],
})
export class WebsitesModule {}
