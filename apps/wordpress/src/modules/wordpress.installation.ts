import {
	AppCategory,
	AppInputType,
	AppIntegrationType,
	AppsService,
	AppStoreIntegrationName,
	AppSettingsDto,
} from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Injectable, OnModuleInit } from '@nestjs/common'

@Injectable()
export class WordpressInstallationService implements OnModuleInit {
	constructor(
		private readonly logger: Logger,
		private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.wordpress,
				},
			})

			if (!app) {
				this.logger.log('Creating WordPress App')
				await this.appsService.create({
					name: 'WordPress',
					url: 'https://wordpress.org',
					integration_type: AppIntegrationType.CREDENTIALS,
					integration_name: AppStoreIntegrationName.wordpress,
					category: AppCategory.cms,
					hexcode: '23282d',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'WORDPRESS_URL',
							name: 'WordPress Website URL',
							input: {
								type: AppInputType.text,
								required: true,
							},
							description: 'Your WordPress URL, including http(s):// but without a trailing slash.',
							private: false,
						},
						<AppSettingsDto>{
							key: 'WORDPRESS_USERNAME',
							name: 'WordPress Username',
							input: {
								type: AppInputType.text,
								required: true,
							},
							description:
								'Your WordPress username which can be found in the users section of your WordPress admin area.',
							private: false,
						},
						<AppSettingsDto>{
							key: 'WORDPRESS_APPLICATION_PASSWORD',
							name: 'WordPress Application Password',
							description:
								'This is a specific application password (not your normal login password) which can be created on the user management page in the WordPress admin.',
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
