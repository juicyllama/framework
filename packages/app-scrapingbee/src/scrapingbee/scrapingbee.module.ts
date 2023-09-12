import { Module } from '@nestjs/common'
import { ScrapingBeeService } from './scrapingbee.service'
import { ScrapingBeeScrapeService } from './scrapingbee.scrape.service'
import { Api, Env, Logger } from '@juicyllama/utils'
import scrapingbeeConfig from '../config/scrapingbee.config'
import { scrapingbeeConfigJoi } from '../config/scrapingbee.config.joi'
import Joi from 'joi'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [scrapingbeeConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object(scrapingbeeConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [ScrapingBeeService, ScrapingBeeScrapeService, Logger, Api],
	exports: [ScrapingBeeService],
})
export class ScrapingBeeModule {}
