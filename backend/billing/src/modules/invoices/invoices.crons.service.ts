import { Cron, CronExpression } from '@nestjs/schedule'
import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { CachePeriod, Logger, Modules } from '@juicyllama/utils'
import { DeepPartial, IsNull } from 'typeorm'
import { Env } from '@juicyllama/utils'
import { SettingsService, CronRunner } from '@juicyllama/core'
import { ChargesService } from '../charges/charges.service'
import { InvoicesService } from './invoices.service'
import { Invoice } from './invoices.entity'
import { Charge } from '../charges/charges.entity'
import { PaymentsService } from '../payments/payments.service'
import { Payment } from '../payments/payments.entity'
import {
	CRON_BILLING_INVOICES_GENERATE_DOMAIN,
	CRON_BILLING_INVOICES_RESEND_DOMAIN,
	CRON_BILLING_INVOICES_SETTLE_DOMAIN,
} from './invoices.constants'

@Injectable()
export class InvoicesCronService {
	constructor(
		@Inject(forwardRef(() => ChargesService)) private readonly chargesService: ChargesService,
		@Inject(forwardRef(() => InvoicesService)) private readonly invoicesService: InvoicesService,
		@Inject(forwardRef(() => PaymentsService)) private readonly paymentsService: PaymentsService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => SettingsService)) private readonly settingsService: SettingsService,
	) {}

	/**
	 * Takes a list of charges not invoices and generates invoices for them
	 */

	@Cron(process.env.CRON_BILLING_INVOICES_GENERATE_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_BILLING_INVOICES_GENERATE,
	})
	async cronGenerateInvoices() {
		return await CronRunner(CRON_BILLING_INVOICES_GENERATE_DOMAIN, this.generateInvoices())
	}

	/**
	 * Takes a list of invoices without external ids and retry to create them
	 */

	@Cron(process.env.CRON_BILLING_INVOICES_RESEND_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_BILLING_INVOICES_RESEND,
	})
	async cronResendInvoices() {
		return await CronRunner(CRON_BILLING_INVOICES_RESEND_DOMAIN, this.resendInvoices())
	}

	/**
	 * Takes a list of unsettled invoices and payments which have not been allocated and attempts to allocate them
	 */

	@Cron(process.env.CRON_BILLING_INVOICES_SETTLE_FREQUENCY ?? CronExpression.EVERY_10_MINUTES, {
		disabled: !process.env.CRON_BILLING_INVOICES_SETTLE,
	})
	async cronSettleInvoices() {
		return await CronRunner(CRON_BILLING_INVOICES_SETTLE_DOMAIN, this.settleInvoices())
	}

	async generateInvoices() {
		const domain = CRON_BILLING_INVOICES_GENERATE_DOMAIN

		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
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

	async resendInvoices() {
		const domain = CRON_BILLING_INVOICES_RESEND_DOMAIN

		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
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

	async settleInvoices() {
		const domain = CRON_BILLING_INVOICES_SETTLE_DOMAIN

		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = await Modules.bugsnag.load()
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
}
