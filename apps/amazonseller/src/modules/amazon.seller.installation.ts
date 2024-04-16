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
export class AmazonSellerInstallationService implements OnModuleInit {
	constructor(
		private readonly logger: Logger,
		private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.amazonseller,
				},
			})

			if (!app) {
				this.logger.log('Creating Amazon Seller App')
				await this.appsService.create({
					name: 'Amazon Seller',
					url: 'https://sellercentral.amazon.com',
					integration_type: AppIntegrationType.OAUTH2,
					integration_name: AppStoreIntegrationName.amazonseller,
					category: AppCategory.marketplace,
					hexcode: 'ff9900',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'MARKETPLACE_ID',
							name: 'The marketplace ID',
							description:
								'The marketplace you wish to connect to, full list here: https://developer-docs.amazon.com/sp-api/docs/marketplace-id',
							input: {
								type: AppInputType.text,
								required: true,
							},
							private: false,
						},
						<AppSettingsDto>{
							key: 'SELLER_ID',
							name: 'Your seller ID',
							description:
								'The seller ID for your account, this can be found in your seller central account',
							input: {
								type: AppInputType.text,
								required: true,
							},
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
