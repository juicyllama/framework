import { forwardRef, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import {
	AppCategory,
	AppInputType,
	AppIntegrationType,
	AppsService,
	AppStoreIntegrationName,
} from '@juicyllama/app-store'

@Injectable()
export class ShopifyInstallationService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
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
					{
						key: 'SHOPIFY_SHOP_NAME',
						name: 'Shopify Shop Name',
						input: {
							type: AppInputType.text,
							required: true,
						},
						description: 'The name of the users shop. e.g. https://{shop}.myshopify.com',
						private: false,
					},
					{
						key: 'SHOPIFY_ADMIN_API_ACCESS_KEY',
						name: 'Shopify Admin API Access Key',
						input: {
							type: AppInputType.text,
						},
						private: true,
						hidden: true,
					}
				],
			})
		}
	}
}
