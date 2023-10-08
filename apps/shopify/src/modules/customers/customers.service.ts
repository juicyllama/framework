import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { Contact, ContactsService } from '@juicyllama/crm'

@Injectable()
export class ShopifyCustomersService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ContactsService)) private readonly constactsService: ContactsService,
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
		// delete contact data

		return
	}
}
