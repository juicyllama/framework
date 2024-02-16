import { DynamicModule } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'

import { GoogleAnalyticsApp } from './google-analytics.app'
import { GoogleAnalyticsInstallationService } from './google-analytics.installation'
import { GoogleAnalyticsConfigModule } from './config/google-analytics.config.module'
import { GoogleAnalyticsOAuthModule } from './oauth/google-analytics.oauth.module'
import { GoogleAnalyticsPropertyModule } from './property/google-analytics.property.module'

export class GoogleAnalyticsModule {
	static forRoot(mountAt = GoogleAnalyticsApp.mountRoutePrefix): DynamicModule {
		GoogleAnalyticsApp.mountRoutePrefix = mountAt

		return {
			module: GoogleAnalyticsModule,
			imports: [
				AppsModule,

				GoogleAnalyticsConfigModule,

				GoogleAnalyticsPropertyModule,
				GoogleAnalyticsOAuthModule,
				RouterModule.register([
					{
						path: mountAt,
						module: GoogleAnalyticsOAuthModule,
					},
					{
						path: mountAt,
						module: GoogleAnalyticsPropertyModule,
					},
				]),
			],
			providers: [GoogleAnalyticsInstallationService, Logger],
		}
	}
}
