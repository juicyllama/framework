import { InstalledApp, InstalledAppsService } from '@juicyllama/app-store'
import { Store, StoresService } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShopifyShopService {
	constructor(
		private readonly logger: Logger,
		private readonly installedAppService: InstalledAppsService,
		private readonly storesService: StoresService,
	) {}

	/**
	 * Purge a shop
	 */

	async purge(installed_app: InstalledApp, store: Store): Promise<void> {
		const domain = 'app::shopify::shop::purge'

		this.logger.log(`[${domain}] Purge Shop`, {
			installed_app: installed_app,
			store: store,
		})

		//TODO
		// delete store
		// delete intstalledApp

		return
	}
}
