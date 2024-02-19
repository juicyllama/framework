import { PaymentsService, PaymentType } from '@juicyllama/billing'
import { Account, AccountService, AppIntegrationName, BaseService, Query } from '@juicyllama/core'
import { Enviroment, SupportedCurrencies, Logger, Env } from '@juicyllama/utils'
import { MollieClient, Payment, PaymentMethod, PaymentStatus, SequenceType } from '@mollie/api-client'
import { BadRequestException, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { MollieCustomer } from '../customer/customer.entity'
import { CustomerService } from '../customer/customer.service'
import { MollieMandate } from '../mandate/mandate.entity'
import { MandateService } from '../mandate/mandate.service'
import { molliePaymentStatus } from '../mollie.mapper'
import { InjectMollie } from '../provider'
import { MolliePayment } from './payment.entity'
import paymentMock from './payment.mock'

const E = MolliePayment
type T = MolliePayment
@Injectable()
export class PaymentService extends BaseService<T> {
	constructor(
		private readonly logger: Logger,
		readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		private readonly accountService: AccountService,
		private readonly configService: ConfigService,
		private readonly customerService: CustomerService,
		private readonly mandateService: MandateService,
		private readonly paymentsService: PaymentsService,
		@InjectMollie() private readonly client: MollieClient,
	) {
		super(query, repository)
	}

	/**
	 * Returns the redirect link to complete the card details
	 */

	async createFirstPayment(data: DeepPartial<T>, description?: string): Promise<string> {
		let mollie_payment = await this.query.create(this.repository, {
			...data,
			method: PaymentMethod.creditcard,
			status: PaymentStatus.pending,
		})

		if (!mollie_payment.customer) {
			mollie_payment = await this.findById(mollie_payment.mollie_payment_id)
		}

		if (!mollie_payment.customer.account) {
			mollie_payment.customer = await this.customerService.findById(mollie_payment.customer.mollie_customer_id)
		}

		let mollie_response: Payment

		try {
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie payment`)
				mollie_response = paymentMock(mollie_payment)
			} else {
				this.logger.debug(`Create mollie payment`, mollie_payment)
				mollie_response = await this.client.payments.create({
					amount: {
						value: mollie_payment.amount.toString(),
						currency: mollie_payment.currency,
					},
					description: description ?? `Add Card - Account #${mollie_payment.customer.account.account_id}`,
					metadata: <any>{
						account_id: mollie_payment.customer.account.account_id,
						customer_id: mollie_payment.customer.mollie_customer_id,
					},
					method: PaymentMethod.creditcard,
					customerId: mollie_payment.customer.ext_customer_id,
					sequenceType: SequenceType.first,
					redirectUrl: `${this.configService.get<string>('BASE_URL_API')}/app/mollie/payment/redirect/${
						mollie_payment.mollie_payment_id
					}`,
					webhookUrl: `${this.configService.get<string>('BASE_URL_API')}/app/mollie/payment/webhook/${
						mollie_payment.mollie_payment_id
					}`,
				})
				this.logger.debug(`Mollie payment response for first payment attempt: `, mollie_response)
			}
		} catch (e) {
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					request: {
						mollie_payment: mollie_payment,
					},
				},
			})
		}

		if (!mollie_response.id) {
			this.logger.error(`Mollie payment ID not in the response`)
			return
		}

		await this.update({
			mollie_payment_id: mollie_payment.mollie_payment_id,
			ext_payment_id: mollie_response.id,
			status: mollie_response.status,
		})

		return mollie_response._links.checkout.href
	}

	/**
	 * Syncs local payment details with mollie
	 * @param payment
	 */

	async syncPayment(payment: MolliePayment): Promise<MolliePayment> {
		let mollie_response: Payment

		if (!payment.customer) {
			payment.customer = await this.customerService.findById(payment.mollie_customer_id)
		}

		if (!payment.customer.account) {
			payment.customer.account = await this.accountService.findById(payment.customer.account_id)
		}

		try {
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie payment`)
				mollie_response = paymentMock(payment)
			} else {
				this.logger.debug(`Get mollie payment`, payment)
				mollie_response = await this.client.payments.get(payment.ext_payment_id)
				this.logger.debug(`Get mollie payment response: `, mollie_response)
			}
		} catch (e) {
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					request: {
						payment: payment,
					},
				},
			})
		}

		if (!mollie_response.id) {
			this.logger.error(`Error: Mollie payment ID not in the response`, {
				mollie_response: mollie_response,
				payment: payment,
			})
			new Error(`Mollie payment ID not in the response`)
		}

		payment = await this.linkMandate(payment, mollie_response)

		await this.update({
			mollie_payment_id: payment.mollie_payment_id,
			status: mollie_response.status,
		})
		payment.status = mollie_response.status

		//push payment to the billing system
		await this.pushPaymentToBillingSystem(payment)

		return payment
	}

	/**
	 * Creates a payment via mollie either by a mandate or latest mandate for the account
	 * @param {number} amount
	 * @param {SupportedCurrencies} currency
	 * @param {Account} account
	 * @param {MollieMandate} [mandate]
	 */

	async createPayment(
		amount: number,
		currency: SupportedCurrencies,
		account: Account,
		mandate?: MollieMandate,
	): Promise<MolliePayment> {
		const customer: MollieCustomer = await this.customerService.findByAccount(account)

		if (!mandate) {
			mandate = await this.mandateService.findOne({
				where: {
					mollie_customer_id: customer.mollie_customer_id,
				},
				order: {
					created_at: 'DESC',
				},
			})
		}

		let mollie_payment = await this.query.create(this.repository, {
			mandate: mandate,
			customer: customer,
			amount: amount,
			currency: currency,
			method: PaymentMethod.creditcard,
			status: PaymentStatus.pending,
		})

		let mollie_response: Payment

		try {
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie payment`)
				mollie_response = paymentMock(mollie_payment)
			} else {
				this.logger.debug(`Create mollie payment`, mollie_payment)
				mollie_response = await this.client.payments.create({
					amount: {
						value: mollie_payment.amount.toString(),
						currency: mollie_payment.currency,
					},
					description: `Charge Card - Mandate #${mandate.mollie_mandate_id}`,
					metadata: <any>{
						account_id: account.account_id,
						customer_id: customer.mollie_customer_id,
						mandate_id: mandate.mollie_mandate_id,
					},
					method: PaymentMethod.creditcard,
					mandateId: mandate.ext_mandate_id,
					customerId: customer.ext_customer_id,
					sequenceType: SequenceType.recurring,
					webhookUrl: `${this.configService.get<string>('BASE_URL_API')}/app/mollie/payment/webhook/${
						mollie_payment.mollie_payment_id
					}`,
				})
				this.logger.debug(`Create mollie payment response: `, mollie_response)
			}
		} catch (e) {
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					request: {
						mollie_payment: mollie_payment,
					},
				},
			})
		}

		if (!mollie_response.id) {
			this.logger.error(`Mollie payment ID not in the response`)
			return
		}

		mollie_payment.ext_payment_id = mollie_response.id
		mollie_payment.status = mollie_response.status

		await this.update({
			mollie_payment_id: mollie_payment.mollie_payment_id,
			ext_payment_id: mollie_response.id,
			status: mollie_response.status,
		})

		mollie_payment = await this.linkMandate(mollie_payment, mollie_response)
		await this.pushPaymentToBillingSystem(mollie_payment)
		return mollie_payment
	}

	async pushPaymentToBillingSystem(payment: MolliePayment) {
		const domain = 'app::mollie::payment::pushPaymentToBillingSystem'

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}] Skipping push payment to billing system in test env`)
			return
		}

		if (!payment.amount) {
			this.logger.error(`[${domain}] Payment amount is not set`, payment)
			return
		}

		await this.paymentsService.paymentResponse({
			account_id: payment.customer.account_id,
			app_integration_name: AppIntegrationName.mollie,
			app_payment_id: payment.mollie_payment_id,
			amount: payment.amount,
			currency: payment.currency,
			payment_status: molliePaymentStatus(payment.status),
			payment_type: payment.amount >= 0 ? PaymentType.payment : PaymentType.refund,
		})

		this.logger.verbose(`[${domain}] Pushing payment response`, {
			account_id: payment.customer.account_id,
			app_integration_name: AppIntegrationName.mollie,
			app_payment_id: payment.mollie_payment_id,
			amount: payment.amount,
			currency: payment.currency,
			payment_status: molliePaymentStatus(payment.status),
			payment_type: payment.amount >= 0 ? PaymentType.payment : PaymentType.refund,
		})
	}

	async linkMandate(payment: MolliePayment, mollie_response: Payment): Promise<MolliePayment> {
		//link mandate
		if (!payment.mandate && mollie_response.mandateId) {
			const mandate = await this.mandateService.create({
				ext_mandate_id: mollie_response.mandateId,
				customer: payment.customer,
			})

			await this.update({
				mollie_payment_id: payment.mollie_payment_id,
				mandate: mandate,
			})

			payment.mandate = mandate
		}

		payment.mandate = await this.mandateService.syncMandate(payment.mandate)

		return payment
	}

	async remove(): Promise<T> {
		throw new BadRequestException(`You cannot delete a customer as it is linked to an external service`)
	}
}
