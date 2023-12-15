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
export class AhrefsInstallationService implements OnModuleInit {
	constructor(
		private readonly logger: Logger,
		private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.ahrefs,
				},
			})

			if (!app) {
				this.logger.log('Creating Ahrefs App')
				await this.appsService.create({
					name: 'Ahrefs',
					url: 'https://ahrefs.com',
					integration_type: AppIntegrationType.API_KEY,
					integration_name: AppStoreIntegrationName.ahrefs,
					category: AppCategory.seo,
					hexcode: '054ADA',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'AHREFS_API_KEY',
							name: 'Ahrefs API Key',
							description: 'The API Key to access the Ahrefs API',
							input: {
								type: AppInputType.text,
							},
							private: true,
						},
					],
				})
			}
		} catch (e: any) {
			this.logger.error(e.message, e)
		}
	}
}
