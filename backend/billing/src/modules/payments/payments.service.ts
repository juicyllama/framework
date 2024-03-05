import { Account, AccountService, AppIntegrationName, BaseService, BeaconService, Query, User } from '@juicyllama/core'
import { Logger, Strings, SupportedCurrencies, File } from '@juicyllama/utils'
import { BadRequestException, Inject, Injectable, NotImplementedException, forwardRef } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { Invoice } from '../invoices/invoices.entity'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { Payment } from './payments.entity'
import { PaymentStatus, PaymentType } from './payments.enums'

const E = Payment
type T = Payment
@Injectable()
export class PaymentsService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => PaymentMethodsService)) private readonly paymentMethodsService: PaymentMethodsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	update(): Promise<T> {
		throw new BadRequestException(`You can't update a payment. You can only create a new one.`)
	}

	delete() {
		throw new BadRequestException(`You can't delete a payment. You must add a charge to reduce the balance.`)
	}

	purge(): Promise<void> {
		throw new BadRequestException(`You can't delete a payment. You must add a charge to reduce the balance.`)
	}

	async create(data: DeepPartial<T>): Promise<T> {
		const payment = await this.query.create(this.repository, data)

		if (!payment?.payment_id) {
			throw new BadRequestException(`Payment not created`)
		}

		const owner = await this.accountService.getOwner(payment.account_id)
		await this.sendBeaconOnCreate(payment, owner)
		return payment
	}

	async allocateFunds(payment: T, invoice: Invoice, amount: number): Promise<T> {
		payment.amount_allocated = Number(payment.amount_allocated) + Number(amount)
		await this.query.update(this.repository, {
			payment_id: payment.payment_id,
			amount_allocated: Number(payment.amount_allocated) + Number(amount),
		})
		//link the invoice to the payment
		await this.query.raw(
			this.repository,
			`INSERT INTO billing_payments_invoices (payment_id, invoice_id)
                                               VALUES (${payment.payment_id}, ${invoice.invoice_id});`,
		)

		return await this.query.findOneById(this.repository, payment.payment_id)
	}

	async getUnallocated(account?: Account, currency?: SupportedCurrencies): Promise<T[]> {
		let sql = `SELECT *
                   FROM billing_payments
                   WHERE billing_payments.amount_allocated < amount`
		if (account) sql += ` AND billing_payments.account_id = ${account.account_id}`
		if (currency) sql += ` AND billing_payments.currency = '${currency}'`
		sql += `;`

		return await this.query.raw(this.repository, sql)
	}

	async paymentResponse(options: {
		account_id: number
		app_integration_name: AppIntegrationName
		app_payment_id: number
		amount: number
		currency: SupportedCurrencies
		payment_status: PaymentStatus
		payment_type?: PaymentType
	}): Promise<void> {
		const domain = 'billing::payments::paymentResponse'

		if (!options.payment_type) {
			options.payment_type = PaymentType.payment
		}

		let payment_method = await this.paymentMethodsService.findOne({
			where: {
				account_id: options.account_id,
				app_integration_name: options.app_integration_name,
			},
			order: {
				created_at: 'DESC',
			},
		})

		if (!payment_method) {
			this.logger.error(`[${domain}] Payment method not found`, {
				account_id: options.account_id,
				app_integration_name: options.app_integration_name,
			})
			return
		}

		const payment = await this.findOne({
			where: {
				payment_method_id: payment_method.payment_method_id,
				app_payment_id: options.app_payment_id,
			},
		})

		if (payment) {
			this.logger.log(
				`[${domain}] Payment already exists for app_payment_id: ${options.app_payment_id}, skipping...`,
			)
			return
		}

		switch (options.payment_type) {
			case PaymentType.payment:
				switch (options.payment_status) {
					case PaymentStatus.success:
						await this.create({
							account_id: options.account_id,
							amount: options.amount,
							currency: options.currency,
							payment_method_id: payment_method.payment_method_id,
							app_payment_id: options.app_payment_id,
							type: options.payment_type,
							method: payment_method.method,
						})

						payment_method = await this.paymentMethodsService.successfulPayment(payment_method)
						return

					case PaymentStatus.declined:
						await this.handleDeclinedPayment(
							options.account_id,
							payment_method,
							options.app_payment_id,
							options.amount,
							options.currency,
							options.payment_status,
							options.payment_type,
						)
						return

					case PaymentStatus.pending:
						//noting to do here
						return
				}

			case PaymentType.dispute:
			case PaymentType.refund:
				//todo handle

				this.logger.error(`[${domain}] Payment Type: ${options.payment_type} not implemented`, {
					account_id: options.account_id,
					app_payment_method_id: payment_method.app_payment_method_id,
					app_payment_id: options.app_payment_id,
					amount: options.amount,
					currency: options.currency,
					payment_status: options.payment_status,
					payment_type: options.payment_type,
				})
				throw new NotImplementedException(`Payment Type: ${options.payment_type} not implemented`)

			default:
				this.logger.error(`[${domain}] Unknown payment type: ${options.payment_type}`, {
					account_id: options.account_id,
					app_payment_method_id: payment_method.app_payment_method_id,
					app_payment_id: options.app_payment_id,
					amount: options.amount,
					currency: options.currency,
					payment_status: options.payment_status,
					payment_type: options.payment_type,
				})
				return
		}
	}

	async handleDeclinedPayment(
		account_id: number,
		payment_method: PaymentMethod,
		app_payment_id: number,
		amount: number,
		currency: SupportedCurrencies,
		payment_status: PaymentStatus,
		payment_type: PaymentType,
	): Promise<void> {
		const domain = 'billing::payments::handleDeclinedPayment'

		const owner = await this.accountService.getOwner(account_id)

		await this.sendBeaconOnDecline(payment_method, owner, amount, currency)

		if (payment_method.attempts && payment_method.attempts >= 5) {
			this.logger.log(`[${domain}] Disabling payment method as 5 declined attempts`, {
				account_id: account_id,
				payment_method: payment_method,
				app_payment_id: app_payment_id,
				amount: amount,
				currency: currency,
				payment_status: payment_status,
				payment_type: payment_type,
			})
			await this.paymentMethodsService.disablePaymentMethod(payment_method)
		}
	}

	/**
	 * Send a beacon when a payment is created if the value is > 0
	 * @param payment
	 * @param user
	 */
	async sendBeaconOnCreate(payment: T, user: User): Promise<void> {
		if (!process.env.BEACON_BILLING_PAYMENT_RECEIVED) {
			return
		}

		if (payment.amount > 0) {
			const amount = new Intl.NumberFormat('en-US', {
				style: 'currency',
				currency: payment.currency,
			}).format(payment.amount)

			let markdown = ``

			if (File.exists(process.env.BEACON_BILLING_PAYMENT_RECEIVED + '/email.md')) {
				markdown = await File.read(process.env.BEACON_BILLING_PAYMENT_RECEIVED + '/email.md')
				markdown = Strings.replacer(markdown, {
					payment: payment,
					user: user,
					amount: amount,
				})
			} else {
				markdown = `A payment of ${amount} has been received via ${Strings.capitalize(
					payment?.method || 'unknown',
				)} and applied to your account.`
			}

			await this.beaconService.notify({
				methods: {
					email: true,
				},
				communication: {
					email: {
						to: payment.account?.finance_email
							? {
									name: payment.account.account_name,
									email: payment.account.finance_email,
								}
							: {
									name: user.first_name + ' ' + user.last_name,
									email: user.email,
								},
					},
				},
				subject: `💸 Payment Received`,
				markdown: markdown,
				json: {
					payment_id: payment.payment_id,
				},
			})
		}
	}

	async sendBeaconOnDecline(
		payment_method: PaymentMethod,
		user: User,
		amount: number,
		currency: SupportedCurrencies,
	): Promise<void> {
		if (!process.env.BEACON_BILLING_PAYMENT_DECLINED) {
			return
		}

		const amount_formatted = new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
		}).format(amount)

		let markdown = ``

		if (File.exists(process.env.BEACON_BILLING_PAYMENT_DECLINED + '/email.md')) {
			markdown = await File.read(process.env.BEACON_BILLING_PAYMENT_DECLINED + '/email.md')
			markdown = Strings.replacer(markdown, {
				payment_method: payment_method,
				user: user,
				amount: amount_formatted,
			})
		} else {
			markdown = `A payment of ${amount_formatted} has been declined. Please check with your payment provider or update your payment method on file.`
		}

		await this.beaconService.notify({
			methods: {
				email: true,
				push: true,
			},
			communication: {
				email: {
					to: payment_method.account.finance_email
						? {
								name: payment_method.account.account_name,
								email: payment_method.account.finance_email,
							}
						: {
								name: user.first_name + ' ' + user.last_name,
								email: user.email,
							},
				},
				event: `account_${payment_method.account.account_id}_billing`,
			},
			subject: `🚨 Payment Declined`,
			markdown: markdown,
			json: {
				payment_method_id: payment_method.payment_method_id,
			},
		})
	}
}
