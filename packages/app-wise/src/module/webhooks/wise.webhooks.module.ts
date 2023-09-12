import { Module } from '@nestjs/common'
import { Logger, Api, Env } from '@juicyllama/utils'
import { WiseWebhooksController } from './wise.webhooks.controller'
import wiseConfig from '../../config/wise.config'
import Joi from 'joi'
import { wiseConfigJoi } from '../../config/wise.config.joi'
import { ConfigModule } from '@nestjs/config'
import { WiseWebhooksService } from './wise.webhooks.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [wiseConfig],
			validationSchema: Env.IsProd() ? Joi.object(wiseConfigJoi) : null,
		}),
	],
	controllers: [WiseWebhooksController],
	providers: [WiseWebhooksService, Logger, Api],
	exports: [WiseWebhooksService],
})
export class WiseWebhooksModule {}
