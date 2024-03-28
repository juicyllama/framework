import { Logger } from '@juicyllama/utils'
import { Injectable, forwardRef, Inject } from '@nestjs/common'

@Injectable()
export class ShopifyCustomersService {
	constructor(@Inject(forwardRef(() => Logger)) readonly logger: Logger) {}

	/**
	 * Purge a contact
	 */

	async purge(contact: any): Promise<void> {
		const domain = 'app::shopify::customer::purge'

		this.logger.log(`[${domain}] Purge Customer`, {
			contact: contact,
		})

		//TODO
		// delete contact data from contacts service

		return
	}
}
