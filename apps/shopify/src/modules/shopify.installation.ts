import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common'
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
export class ShopifyInstallationService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => AppsService)) readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.shopify,
				},
			})

			if (!app) {
				this.logger.log('Creating Shopify App')
				await this.appsService.create({
					name: 'Shopify',
					url: 'https://shopify.com',
					integration_type: AppIntegrationType.OAUTH2,
					integration_name: AppStoreIntegrationName.shopify,
					category: AppCategory.ecommerce,
					hexcode: '96bf48',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'SHOPIFY_SHOP_NAME',
							name: 'Shopify Shop Name',
							input: {
								type: AppInputType.text,
								required: true,
							},
							description: 'The name of the users shop. e.g. https://{shop}.myshopify.com',
							private: false,
						},
						<AppSettingsDto>{
							key: 'SHOPIFY_ADMIN_API_ACCESS_KEY',
							name: 'Shopify Admin API Access Key',
							description: 'Skip the Oauth process and use the provided Admin API Access Key',
							input: {
								type: AppInputType.text,
							},
							private: true,
							hidden: true,
						},
					],
				})
			}
		} catch (e: any) {
			this.logger.error(e.message, e)
		}
	}
}
