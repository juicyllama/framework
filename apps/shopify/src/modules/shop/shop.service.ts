import { InstalledApp } from '@juicyllama/app-store'
import { Store } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'

@Injectable()
export class ShopifyShopService {
	constructor(@Inject(forwardRef(() => Logger)) readonly logger: Logger) {}

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
