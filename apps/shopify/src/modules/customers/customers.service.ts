import { Contact, ContactsService } from '@juicyllama/crm'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ShopifyCustomersService {
	constructor(
		private readonly logger: Logger,
		private readonly constactsService: ContactsService,
	) {}

	/**
	 * Purge a contact
	 */

	async purge(contact: Contact): Promise<void> {
		const domain = 'app::shopify::customer::purge'

		this.logger.log(`[${domain}] Purge Customer`, {
			contact: contact,
		})

		//TODO
		// delete contact data from contacts service

		return
	}
}
