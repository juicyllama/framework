import {
	AppCategory,
	AppInputType,
	AppIntegrationType,
	AppsService,
	AppStoreIntegrationName,
	AppSettingsDto,
} from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Injectable, OnModuleInit, forwardRef, Inject } from '@nestjs/common'

@Injectable()
export class ShipbobInstallationService implements OnModuleInit {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AppsService)) private readonly appsService: AppsService,
	) {}

	async onModuleInit() {
		try {
			const app = await this.appsService.findOne({
				where: {
					integration_name: AppStoreIntegrationName.shipbob,
				},
			})

			if (!app) {
				this.logger.log('Creating Shipbob App')
				await this.appsService.create({
					name: 'Shipbob',
					url: 'https://shipbob.com',
					integration_type: AppIntegrationType.CREDENTIALS,
					integration_name: AppStoreIntegrationName.shipbob,
					category: AppCategory.fulfillment,
					hexcode: '175cff',
					active: true,
					hidden: false,
					settings: [
						<AppSettingsDto>{
							key: 'SHIPBOB_PAT_TOKEN',
							name: 'Shipbob Pat Token',
							input: {
								type: AppInputType.text,
								required: true,
							},
							description: 'Get your Shipbob PAT token from the Shipbob dashboard.',
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
