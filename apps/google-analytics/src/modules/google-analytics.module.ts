import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { GoogleAnalyticsProviderModule } from './provider/provider.module'
import { GoogleAnalyticsInstallationService } from './google-analytics.installation'
import { PropertyModule } from './property/property.module';

@Module({
	imports: [AppsModule, GoogleAnalyticsProviderModule, PropertyModule],
	providers: [GoogleAnalyticsInstallationService, Logger],
	exports: [GoogleAnalyticsProviderModule],
})
export class GoogleAnalyticsModule {}
