import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { InstalledApp, InstalledAppsService } from '@juicyllama/app-store'
import { Store, StoresService } from '@juicyllama/ecommerce'

@Injectable()
export class ShopifyShopService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => InstalledAppsService)) private readonly installedAppService: InstalledAppsService,
		@Inject(forwardRef(() => StoresService)) private readonly storesService: StoresService,
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
