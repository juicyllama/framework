import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CachePeriod, Logger, Modules } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { DeepPartial, IsNull, LessThan, LessThanOrEqual } from 'typeorm'
import { Enviroment, Dates } from '@juicyllama/utils'
import { SubscriptionsService } from '../subscriptions/subscriptions.service'
import { AccountService, SettingsService, TagsService } from '@juicyllama/core'
import { ChargesService } from '../charges/charges.service'
import { InvoicesService } from '../invoices/invoices.service'
import { Invoice } from '../invoices/invoices.entity'
import { Charge } from '../charges/charges.entity'
import { PaymentsService } from '../payments/payments.service'
import { Payment } from '../payments/payments.entity'
import { Wallet } from '../wallet/wallet.entity'
import { WalletService } from '../wallet/wallet.service'
import { PaymentMethod } from '../payment_methods/payment.methods.entity'
import { PaymentMethodsService } from '../payment_methods/payment.methods.service'
import { PaymentMethodStatus } from '../payment_methods/payment.methods.enums'
import { Withdrawal } from '../withdrawals/withdrawals.entity'
import { WithdrawalsService } from '../withdrawals/withdrawals.service'
import { WithdrawalStatus } from '../withdrawals/withdrawals.enums'

@Injectable()
export class BillingCronService {
	constructor(
		@Inject(forwardRef(() => AccountService)) private readonly accountService: AccountService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => ChargesService)) private readonly chargesService: ChargesService,
		@Inject(forwardRef(() => InvoicesService)) private readonly invoicesService: InvoicesService,
		@Inject(forwardRef(() => PaymentsService)) private readonly paymentsService: PaymentsService,
		@Inject(forwardRef(() => PaymentMethodsService)) private readonly paymentMethodsService: PaymentMethodsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => TagsService)) private readonly tagsService: TagsService,
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
		@Inject(forwardRef(() => WalletService)) private readonly walletService: WalletService,
		@Inject(forwardRef(() => WithdrawalsService)) private readonly withdrawalsService: WithdrawalsService,
		@Inject(forwardRef(() => SubscriptionsService)) private readonly subscriptionsService: SubscriptionsService,
	) {}

	/**
	 * CRON: Every 1 hour:
	 *
	 * Generate charges for subscriptions which need re-billing
	 */

	async rebill() {
		const domain = 'cron::billing::rebill'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const subscriptions = await this.subscriptionsService.findAll({
			where: {
				next_rebill_at: LessThanOrEqual(new Date()),
			},
		})

		this.logger.log(`[${domain}] ${subscriptions.length} Subscriptions Found`)

		const subscriptionsPromises = []
		for (const subscription of subscriptions) {
			const promise = new Promise((res, rej) => {
				this.chargesService
					.create({
						account: subscription.account,
						amount_subtotal: subscription.amount_subtotal,
						amount_tax: subscription.amount_tax,
						amount_total: subscription.amount_total,
						currency: subscription.currency,
						tags: subscription.tags,
						name: subscription.name,
						description: subscription.description,
					})
					.then(() => {
						this.subscriptionsService.update({
							subscription_id: subscription.subscription_id,
							next_rebill_at: Dates.nextDate(subscription.frequency),
						})
						res(subscription.subscription_id)
					})
					.catch(e => {
						rej(e.message)
					})
			})
			subscriptionsPromises.push(promise)
			this.logger.log(`[${domain}] Subscription #${subscription.subscription_id}`, subscription)
		}
		const subscriptionsOutcomes = await Promise.allSettled(subscriptionsPromises)

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			subscriptions: {
				total: subscriptions.length,
				success: subscriptionsOutcomes.filter(o => o.status === 'fulfilled').length,
				failed: subscriptionsOutcomes.filter(o => o.status === 'rejected').length,
				failures: subscriptionsOutcomes.filter(o => o.status === 'rejected'),
			},
		}
	}

	/**
	 * Takes a list of charges not invoices and generates invoices for them
	 */

	async generateInvoices() {
		const domain = 'cron::billing::generateInvoices'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const charges = await this.chargesService.findAll({
			where: {
				is_invoiced: false,
			},
		})

		this.logger.log(`[${domain}] ${charges.length} Chargers Found`)

		const account_ids = [...new Set(charges.map(c => c.account.account_id))]

		const invoicePromises = []
		const invoices = []
		for (const account_id of account_ids) {
			const promise = new Promise((res, rej) => {
				const account_charges = charges.filter(c => c.account.account_id === account_id)

				const invoice: DeepPartial<Invoice> = {
					account: account_charges[0].account,
					currency: account_charges[0].currency,
					amount_subtotal: account_charges.reduce(
						(a: number, b: Charge) => Number(a) + Number(b.amount_subtotal),
						0,
					),
					amount_tax: account_charges.reduce((a: number, b: Charge) => Number(a) + Number(b.amount_tax), 0),
					amount_total: account_charges.reduce(
						(a: number, b: Charge) => Number(a) + Number(b.amount_total),
						0,
					),
					charges: account_charges,
				}

				this.invoicesService
					.create(invoice)
					.then(async invoice => {
						for (const account_charge of account_charges) {
							await this.chargesService.linkInvoice(account_charge.charge_id, invoice)
							this.logger.verbose(
								`[${domain}] Charge #${account_charge.charge_id} linked to Invoice #${invoice.invoice_id}`,
							)
						}
						invoices.push(invoice)
						this.logger.log(`[${domain}] Invoice #${invoice.invoice_id} created`, invoice)
						res(invoice.invoice_id)
					})
					.catch(e => {
						rej(e.message)
					})
			})
			invoicePromises.push(promise)
		}
		const invoiceOutcomes = await Promise.allSettled(invoicePromises)

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			charges: {
				total: charges.length,
			},
			invoices: {
				total: invoices.length,
				success: invoiceOutcomes.filter(o => o.status === 'fulfilled').length,
				failed: invoiceOutcomes.filter(o => o.status === 'rejected').length,
				failures: invoiceOutcomes.filter(o => o.status === 'rejected'),
			},
		}
	}

	/**
	 * Takes a list of invoices without external ids and retry to create them
	 */

	async resendInvoices() {
		const domain = 'cron::billing::resendInvoices'

		console.log('retryInvoices', domain)

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const invoices = await this.invoicesService.findAll({
			where: {
				app_invoice_id: IsNull(),
			},
			relations: ['account', 'charges', 'charges.tags'],
		})

		this.logger.log(`[${domain}] ${invoices.length} Invoices Found`)

		let resend_attempted = 0
		let resend_success = 0
		let resend_failed = 0

		for (const invoice of invoices) {
			resend_attempted++

			const result = await this.invoicesService.retryPostingInvoice(invoice)
			if (result?.app_invoice_id) {
				this.logger.log(
					`[${domain}] Invoice #${invoice.invoice_id} posted to ${result.app_integration_name} with ID #${result.app_invoice_id}`,
					result,
				)
				resend_success++
			} else {
				this.logger.error(`[${domain}] Invoice #${invoice.invoice_id} failed to post`, invoice)
				resend_failed++
			}
		}

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			attempted: resend_attempted,
			success: resend_success,
			failed: resend_failed,
		}
	}

	/**
	 * CRON: Every 1 hour:
	 *
	 * Takes a list of unsettled invoices and payments which have not been allocated and attempts to allocate them
	 */

	async settleInvoices() {
		const domain = 'cron::billing::settleInvoices'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const invoices: Invoice[] = await this.invoicesService.getUnpaid()

		this.logger.log(`[${domain}] ${invoices.length} Invoices Found`)

		let invoices_unpaid = 0
		let invoices_settled = 0
		let invoices_part_settled = 0

		for (const invoice of invoices) {
			const payments: Payment[] = await this.paymentsService.getUnallocated(invoice.account, invoice.currency)

			if (!payments) {
				this.logger.log(`[${domain}] No Payments Found for Invoice #${invoice.invoice_id}`)
				invoices_unpaid++
				continue
			}

			for (const payment of payments) {
				const payment_unallocated = Number(Number(payment.amount) - Number(payment.amount_allocated))
				const invoice_unpaid = Number(Number(invoice.amount_total) - Number(invoice.amount_paid))

				if (payment_unallocated >= invoice_unpaid) {
					// Payment is greater than or equal to the remaining amount on the invoice
					await this.invoicesService.addPayment(invoice, invoice_unpaid)
					await this.paymentsService.allocateFunds(payment, invoice, invoice_unpaid)
					this.logger.log(
						`[${domain}] Invoice #${invoice.invoice_id} settled by Payment #${payment.payment_id}`,
					)
					await this.invoicesService.update({
						invoice_id: invoice.invoice_id,
						paid_at: new Date(),
					})
					invoices_settled++
				} else {
					// Payment is less than the remaining amount on the invoice
					await this.invoicesService.addPayment(invoice, payment_unallocated)
					await this.paymentsService.allocateFunds(payment, invoice, payment_unallocated)
					this.logger.log(
						`[${domain}] Invoice #${invoice.invoice_id} part settled by Payment #${payment.payment_id}`,
					)
					invoices_part_settled++
				}
			}
		}

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			invoices: {
				total: invoices.length,
				paid: invoices_settled,
				part_paid: invoices_part_settled,
				unpaid: invoices_unpaid,
			},
		}
	}

	/**
	 * CRON: However often you want to run the billing to cards
	 *
	 * Takes a list of negative wallet values and attempts to charge for them
	 */

	async settleBalances() {
		const domain = 'cron::billing::settleBalances'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const wallets: Wallet[] = await this.walletService.findNegativeAccounts()

		this.logger.log(`[${domain}] ${wallets.length} Negative Balances Found`)

		let rebills_attempted = 0
		let rebills_no_payment_method = 0

		for (const wallet of wallets) {
			const payment_method: PaymentMethod = await this.paymentMethodsService.findOne({
				where: {
					account: {
						account_id: wallet.account_id,
					},
					currency: wallet.currency,
					can_charge: true,
					next_attempt_at: LessThan(new Date()),
					status: PaymentMethodStatus.active,
				},
			})

			if (!payment_method) {
				this.logger.log(
					`[${domain}] No active payment method found for account #${wallet.account_id} with currency ${wallet.currency}`,
				)
				rebills_no_payment_method++
				continue
			}

			this.logger.log(
				`[${domain}] Charge attempt #${payment_method.attempts + 1} for account #${wallet.account_id}`,
			)
			await this.paymentMethodsService.charge(payment_method, Number(0 - wallet.balance))
			rebills_attempted++
		}

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			rebill: {
				total: wallets.length,
				attempted: rebills_attempted,
				no_payment_method: rebills_no_payment_method,
			},
		}
	}

	/**
	 * CRON: Every 1 hour:
	 *
	 * Takes a list of withdrawal requests and attempts to settle them
	 */

	async settleWithdrawals() {
		const domain = 'cron::billing::settleWithdrawals'

		if (![Enviroment.test].includes(this.configService.get('NODE_ENV'))) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata('cron', {
					domain: domain,
				})
			}
		}

		if (!(await this.settingsService.cronCheck(domain, CachePeriod.HOUR))) {
			return
		}

		const withdrawals: Withdrawal[] = await this.withdrawalsService.findAll({
			where: {
				status: WithdrawalStatus.PENDING,
			},
		})

		this.logger.log(`[${domain}] ${withdrawals.length} Pending Withdrawals Found`)

		const withdrawalsPromises = []

		for (const withdrawal of withdrawals) {
			const promise = new Promise((res, rej) => {
				this.paymentMethodsService
					.remit(withdrawal.payment_method /*withdrawal.amount*/)
					.then(async remit => {
						if (remit) {
							await this.withdrawalsService.updateStatus(withdrawal, WithdrawalStatus.PROCESSING)
							this.logger.log(
								`[${domain}] Withdrawal #${withdrawal.withdrawal_id} send for processing`,
								withdrawal,
							)
						} else {
							await this.withdrawalsService.updateStatus(withdrawal, WithdrawalStatus.MANUAL)
							this.logger.log(
								`[${domain}] Withdrawal #${withdrawal.withdrawal_id} requires manual processing`,
								withdrawal,
							)
						}
						res(withdrawal.withdrawal_id)
					})
					.catch(e => {
						console.error(e)
						rej(e.message)
					})
			})
			withdrawalsPromises.push(promise)
		}
		const withdrawalsOutcomes = await Promise.allSettled(withdrawalsPromises)

		// Wrap-up and return results
		await this.settingsService.cronEnd(domain)

		return {
			withdrawals: {
				total: withdrawals.length,
				success: withdrawalsOutcomes.filter(o => o.status === 'fulfilled').length,
				failed: withdrawalsOutcomes.filter(o => o.status === 'rejected').length,
				failures: withdrawalsOutcomes.filter(o => o.status === 'rejected'),
			},
		}
	}
}
