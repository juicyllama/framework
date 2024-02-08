import { Module } from '@nestjs/common'

import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'

import { GoogleAnalyticsInstallationService } from './google-analytics.installation'
import { PropertyModule } from './property/property.module'
import { AuthModule } from './auth/auth.module'
import { GoogleAnalyticsConfigModule } from './config/google-analytics.config.module'

@Module({
	imports: [AppsModule, PropertyModule, AuthModule, GoogleAnalyticsConfigModule],
	providers: [GoogleAnalyticsInstallationService, Logger],
})
export class GoogleAnalyticsModule {}
