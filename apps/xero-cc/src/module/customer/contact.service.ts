import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Logger } from '@juicyllama/utils'
import { XeroContact } from './contact.entity'
import { Enviroment } from '@juicyllama/utils'
import { Account, Query } from '@juicyllama/core'
import contactMock from './contact.mock'
import { AuthService } from '../xero.auth.service'
import { accountToContact } from './contact.mapper'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class ContactService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<XeroContact>,
		@InjectRepository(XeroContact) private readonly repository: Repository<XeroContact>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async getOrCreate(account: Account): Promise<XeroContact> {
		const domain = 'app::xero_cc::contact::getOrCreate'

		const result = await this.query.findOne(this.repository, {
			where: {
				account: {
					account_id: account.account_id,
				},
			},
		})

		if (result) {
			return result
		}

		if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
			this.logger.verbose(`[${domain}][Test] Mock xero contact`)

			return await this.query.create(this.repository, {
				ext_contact_id: contactMock().contactID,
				account: account,
			})
		}

		this.logger.debug(`[${domain}] Create xero contact - request`, account)
		const xero = await this.authService.accessToken()
		const response = await xero.accountingApi.createContacts(
			'',
			{ contacts: [accountToContact(account)] },
			null,
			true,
		)
		this.logger.debug(`[${domain}] Create xero contact - response:`, response)

		const xero_response_body = response?.body
		this.logger.debug(`[${domain}] Xero Contact`, xero_response_body)

		if (!xero_response_body.contacts.length || !xero_response_body.contacts[0].contactID) {
			this.logger.error(`[${domain}] Xero contact not in the response body`, xero_response_body)
			return
		}

		const xero_contact = xero_response_body.contacts[0]

		return await this.query.create(this.repository, {
			ext_contact_id: xero_contact.contactID,
			account: account,
		})
	}
}
