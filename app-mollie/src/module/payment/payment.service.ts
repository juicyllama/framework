import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Enviroment, SupportedCurrencies, Logger, Env } from '@juicyllama/utils'
import { MolliePayment } from './payment.entity'
import { ConfigService } from '@nestjs/config'
import { createMollieClient, Payment, PaymentMethod, PaymentStatus, SequenceType } from '@mollie/api-client'
import { MandateService } from '../mandate/mandate.service'
import paymentMock from './payment.mock'
import { CustomerService } from '../customer/customer.service'
import { Account, AppIntegrationName, BaseService, Query } from '@juicyllama/core'
import { MollieMandate } from '../mandate/mandate.entity'
import { MollieCustomer } from '../customer/customer.entity'
import { molliePaymentStatus } from '../mollie.mapper'
import { PaymentsService, PaymentType } from '@juicyllama/billing'

const E = MolliePayment
type T = MolliePayment
@Injectable()
export class PaymentService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => CustomerService)) private readonly customerService: CustomerService,
		@Inject(forwardRef(() => MandateService)) private readonly mandateService: MandateService,
		@Inject(forwardRef(() => PaymentsService)) private readonly paymentsService: PaymentsService,
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
				const mollieClient = createMollieClient({
					apiKey: this.configService.get<string>('mollie.MOLLIE_API_KEY'),
				})
				mollie_response = await mollieClient.payments.create({
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
			payment = await this.findById(payment.mollie_payment_id)
		}

		if (!payment.customer.account) {
			payment.customer = await this.customerService.findById(payment.customer.mollie_customer_id)
		}

		try {
			if (Enviroment[process.env.NODE_ENV] === Enviroment.test) {
				this.logger.verbose(`[Test] Mock mollie payment`)
				mollie_response = paymentMock(payment)
			} else {
				this.logger.debug(`Get mollie payment`, payment)
				const mollieClient = createMollieClient({
					apiKey: this.configService.get<string>('mollie.MOLLIE_API_KEY'),
				})
				mollie_response = await mollieClient.payments.get(payment.ext_payment_id)
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
					customer: {
						mollie_customer_id: customer.mollie_customer_id,
					},
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
				const mollieClient = createMollieClient({
					apiKey: this.configService.get<string>('mollie.MOLLIE_API_KEY'),
				})
				mollie_response = await mollieClient.payments.create({
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

		await this.paymentsService.paymentResponse(
			AppIntegrationName.mollie,
			payment.mandate.mollie_mandate_id,
			payment.mollie_payment_id,
			payment.amount,
			payment.currency,
			molliePaymentStatus(payment.status),
			payment.amount >= 0 ? PaymentType.payment : PaymentType.refund,
		)

		this.logger.verbose(`[${domain}] Pushing payment response`, {
			app_integration_name: AppIntegrationName.mollie,
			mollie_mandate_id: payment.mandate.mollie_mandate_id,
			mollie_payment_id: payment.mollie_payment_id,
			amount: payment.amount,
			currency: payment.currency,
			status: molliePaymentStatus(payment.status),
			type: payment.amount >= 0 ? PaymentType.payment : PaymentType.refund,
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
