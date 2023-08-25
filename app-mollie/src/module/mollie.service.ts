import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { Account } from '@juicyllama/core'
import { CustomerService } from './customer/customer.service'
import { PaymentService } from './payment/payment.service'
import { MandateService } from './mandate/mandate.service'
import { SupportedCurrencies, Logger } from '@juicyllama/utils'
import { MollieMandate } from './mandate/mandate.entity'
import { MolliePayment } from './payment/payment.entity'

@Injectable()
export class MollieService {
	constructor(
		@Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
		@Inject(forwardRef(() => MandateService)) private readonly mandateService: MandateService,
		@Inject(forwardRef(() => PaymentService)) private readonly paymentService: PaymentService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	/**
	 * Add Card
	 *
	 * * Create Mollie Customer (If needed)
	 * * Create First Payment
	 * * Redirect To Enter Card Details
	 */

	async addCard(account: Account, description?: string): Promise<string> {
		const mollie_customer = await this.customerService.create(account)
		return await this.paymentService.createFirstPayment(
			{
				amount: 0.0,
				currency: account.currency,
				customer: mollie_customer,
			},
			description,
		)
	}

	/**
	 * List Cards
	 *
	 * * Returns all the payment mandates for the account
	 *
	 * @param {Account} account
	 */

	async listCards(account: Account): Promise<MollieMandate[]> {
		const mollie_customer = await this.customerService.findByAccount(account)

		if (!mollie_customer) {
			//todo move to app error logging
			this.logger.error(`Cannot find mollie customer from account #${account.account_id}`, account)
			return
		}

		return await this.mandateService.findAll({
			where: {
				customer: {
					mollie_customer_id: mollie_customer.mollie_customer_id,
				},
			},
		})
	}

	/**
	 * Create payment
	 *
	 * * Charges the specified mandate or most recent mandate for account
	 */

	async charge(
		amount: number,
		currency: SupportedCurrencies,
		account: Account,
		mollie_mandate_id?: number,
	): Promise<MolliePayment> {
		const mandate = await this.mandateService.findById(mollie_mandate_id)
		if (!mandate) {
			throw new BadRequestException(`Cannot find mandate with mollie_mandate_id #${mollie_mandate_id}`)
		}
		return await this.paymentService.createPayment(amount, currency, account, mandate)
	}

	/**
	 * Get payment - returns payment from mollie payment table
	 *
	 *
	 */

	async getPayment(id: number): Promise<MolliePayment> {
		return await this.paymentService.findById(id)
	}
}
