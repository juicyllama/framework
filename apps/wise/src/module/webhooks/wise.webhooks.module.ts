import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger, Api } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WiseConfigDto } from '../../config/wise.config.dto'
import { WiseApiUrl } from '../../config/wise.config'
import { WiseUrlToken } from './wise.constants'
import { WiseWebhooksController } from './wise.webhooks.controller'
import { WiseWebhooksService } from './wise.webhooks.service'

@Module({
	imports: [ConfigValidationModule.register(WiseConfigDto)],
	controllers: [WiseWebhooksController],
	providers: [
		WiseWebhooksService,
		Logger,
		Api,
		{
			provide: WiseUrlToken,
			inject: [getConfigToken(WiseConfigDto)],
			useFactory: (config: WiseConfigDto) =>
				`${WiseApiUrl()}/v3/profiles/${config.WISE_PROFILE_ID}/subscriptions`,
		},
	],
	exports: [WiseWebhooksService],
})
export class WiseWebhooksModule {}
