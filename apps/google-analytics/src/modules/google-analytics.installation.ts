import { Injectable, OnModuleInit } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import {
	AppCategory,
	AppInputType,
	AppIntegrationType,
	AppsService,
	AppStoreIntegrationName,
	AppSettingsDto,
} from '@juicyllama/app-store'

@Injectable()
export class GoogleAnalyticsInstallationService implements OnModuleInit {
	constructor(
		private readonly logger: Logger,
		private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.ga4,
				},
			})

			if (!app) {
				this.logger.log('Creating Google Analytics 4 App')
				await this.appsService.create({
					name: 'Google Analytics 4',
					url: 'https://analytics.google.com/',
					integration_type: AppIntegrationType.OAUTH2,
					integration_name: AppStoreIntegrationName.ga4,
					category: AppCategory.seo,
					hexcode: '96bf48',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'GOOGLE_ANALYTICS_PROPERTY_ID',
							name: 'Google Analytics Property ID',
							input: {
								type: AppInputType.text,
								required: true,
							},
							description: 'Numeric Property ID at Analytics -> Admin -> Property Details',
							private: false,
						},
					],
				})
			}
		} catch (e: any) {
			this.logger.error(e.message, e)
		}
	}
}
