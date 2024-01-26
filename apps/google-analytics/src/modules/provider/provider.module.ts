import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { AnalyticsClientFactory } from '../../config/google-analytics.config'
import { GoogleAnalyticsConfigDto } from '../../config/google-analytics.config.dto'
import { GOOGLE_ANALYTICS_PROVIDER_TOKEN } from './provider.constants'

@Module({
	imports: [ConfigValidationModule.register(GoogleAnalyticsConfigDto)],
	providers: [
		{
			provide: GOOGLE_ANALYTICS_PROVIDER_TOKEN,
			inject: [getConfigToken(GoogleAnalyticsConfigDto)],
			useFactory: AnalyticsClientFactory,
		},
	],
	exports: [GOOGLE_ANALYTICS_PROVIDER_TOKEN],
})
export class GoogleAnalyticsProviderModule {}
