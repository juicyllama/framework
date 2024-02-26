import { Modules, Logger } from '@juicyllama/utils'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { App } from '../../apps.entity'
import { AppIntegrationStatus } from '../../apps.enums'
import { preInstallCheckResponse } from '../installed.dto'
import { InstalledAppsService } from '../installed.service'

@Injectable()
export class ShopifyService {
	constructor(
		private readonly logger: Logger,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppsService: InstalledAppsService,
	) {}

	async precheckShopify(
		domain: string,
		app: App,
		settings: any,
		account_id: number,
	): Promise<preInstallCheckResponse> {
		if (!Modules.shopify.isInstalled) {
			return {
				result: false,
				error: `Shopify is not installed`,
			}
		}

		//check if there is already a installed app for this shop and if so, do we have a connected token

		const installedApps = await this.installedAppsService.findAll({
			where: {
				account_id: account_id,
				app_id: app.app_id,
			},
		})

		for (const installedApp of installedApps) {
			if (
				installedApp.settings.SHOPIFY_SHOP_NAME === settings.SHOPIFY_SHOP_NAME &&
				installedApp.integration_status === AppIntegrationStatus.CONNECTED
			) {
				this.logger.log(`[${domain}] You already have a connected app for this shop`)

				return {
					result: false,
					error: `You already have a connected app for this shop`,
				}
			}
		}

		return {
			result: true,
		}
	}
}
