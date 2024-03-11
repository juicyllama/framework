import { Module } from '@nestjs/common'
import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'

import { GoogleAnalyticsConfigDto } from './google-analytics.config.dto'

@Module({
	imports: [ConfigValidationModule.register(GoogleAnalyticsConfigDto)],
	providers: [
		{
			provide: GoogleAnalyticsConfigDto,
			inject: [getConfigToken(GoogleAnalyticsConfigDto)],
			useFactory: (env: GoogleAnalyticsConfigDto) => {
				const config = new GoogleAnalyticsConfigDto()
				for (const key of Object.keys(config)) {
					config[key] = env[key]
				}

				return config
			},
		},
	],
	exports: [GoogleAnalyticsConfigDto],
})
export class GoogleAnalyticsConfigModule {}
