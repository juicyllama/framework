import { DynamicModule } from '@nestjs/common'
import { RouterModule } from '@nestjs/core'

import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'

import { GoogleAnalyticsApp } from './google-analytics.app'
import { GoogleAnalyticsInstallationService } from './google-analytics.installation'
import { GoogleAnalyticsConfigModule } from './config/google-analytics.config.module'
import { AuthModule } from './auth/auth.module'
import { PropertyModule } from './property/property.module'

export class GoogleAnalyticsModule {
	static forRoot(mountAt = GoogleAnalyticsApp.mountRoutePrefix): DynamicModule {
		GoogleAnalyticsApp.mountRoutePrefix = mountAt

		return {
			module: GoogleAnalyticsModule,
			imports: [
				AppsModule,

				GoogleAnalyticsConfigModule,

				PropertyModule,
				AuthModule,
				RouterModule.register([
					{
						path: mountAt,
						module: AuthModule,
					},
					{
						path: mountAt,
						module: PropertyModule,
					},
				]),
			],
			providers: [GoogleAnalyticsInstallationService, Logger],
		}
	}
}
