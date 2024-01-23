import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Logger } from '@juicyllama/utils'
import { XeroInvoice } from './invoice.entity'
import { Dates, Env } from '@juicyllama/utils'
import invoiceMock from './invoice.mock'
import { Invoice, Payment } from 'xero-node'
import { AuthService } from '../xero.auth.service'
import { XeroContact } from '../customer/contact.entity'
import { Account, Query } from '@juicyllama/core'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class InvoiceService {
	constructor(
		@Inject(forwardRef(() => Query)) private readonly query: Query<XeroInvoice>,
		@InjectRepository(XeroInvoice) private readonly repository: Repository<XeroInvoice>,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => AuthService)) private readonly authService: AuthService,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async getOrCreate(options: {
		contact: XeroContact
		account: Account
		invoice: Invoice
		email: boolean
	}): Promise<XeroInvoice> {
		const domain = 'app::xero_cc::invoice::getOrCreate'

		const result = await this.query.findOne(this.repository, {
			where: {
				reference: options.invoice.reference,
			},
		})

		if (result) {
			return result
		}

		if (Env.IsTest()) {
			this.logger.verbose(`[${domain}][Test] Mock xero invoice`)

			return await this.query.create(this.repository, {
				contact: options.contact,
				ext_invoice_id: invoiceMock().invoiceID,
				reference: options.invoice.reference,
				amount_due: invoiceMock().amountDue,
				amount_paid: invoiceMock().amountPaid,
			})
		}

		const data = {
			...options.invoice,
			contact: {
				contactID: options.contact.ext_contact_id,
			},
		}

		this.logger.debug(`[${domain}] Create xero invoice - request`, data)
		const xero = await this.authService.accessToken()

		const response = await xero.accountingApi.createInvoices('', { invoices: [data] }, undefined, true, 4)
		this.logger.debug(`[${domain}] Create xero invoice - response`, response)

		const xero_response_body = response?.body
		this.logger.debug(`[${domain}] Xero Invoice`, xero_response_body)

		if (!xero_response_body?.invoices?.length || !xero_response_body.invoices[0].invoiceID) {
			this.logger.error(`[${domain}] Xero invoice not in the response body`, xero_response_body)
			throw new Error('Xero invoice not in the response body')
		}

		const xero_invoice = xero_response_body.invoices[0]

		if (!xero_invoice.invoiceID) {
			throw new Error('Xero invoice not in the response body')
		}

		if (options.email) {
			const emailed = await xero.accountingApi.emailInvoice('', xero_invoice.invoiceID, {})
			this.logger.debug(`[${domain}] Emailed invoice response`, emailed)
		}

		return await this.query.create(this.repository, {
			contact: options.contact,
			ext_invoice_id: xero_invoice.invoiceID,
			reference: options.invoice.reference,
			amount_due: xero_invoice.amountDue,
			amount_paid: xero_invoice.amountPaid,
		})
	}

	async createPayment(xero_invoice_id: number, amount: number): Promise<XeroInvoice> {
		const domain = 'app::xero_cc::invoice::createPayment'

		const invoice = await this.findById(xero_invoice_id)

		try {
			if (Env.IsTest()) {
				this.logger.verbose(`[${domain}][Test] Mock xero invoice payment`)
			} else {
				const new_xero_payment: Payment = {
					invoice: {
						invoiceID: invoice.ext_invoice_id,
					},
					account: {
						accountID: this.configService.get<string>('xero_cc.XERO_CC_DEFAULT_BANK_ACCOUNT_ID'),
					},
					amount: amount,
					date: Dates.format(new Date(), 'YYYY-MM-DD'),
				}

				this.logger.debug(`[${domain}] Create xero invoice payment`, new_xero_payment)
				const xero = await this.authService.accessToken()
				const response = await xero.accountingApi.createPayment('', new_xero_payment)
				if (!response.body.payments?.length) {
					this.logger.error(`[${domain}] Xero payment not in the response body`, response.body)
					throw new Error('Xero payment not in the response body')
				}
				this.logger.debug(`[${domain}] Create xero invoice payment response:`, response.body.payments[0])
			}

			return await this.syncInvoice(invoice)
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error: ${e.message}`, {
				error: {
					message: e.message,
					stack: e.stack,
				},
				request: {
					invoice: invoice,
				},
			})
			throw e
		}
	}

	async findById(xero_invoice_id: number, relations?: string[]): Promise<XeroInvoice> {
		return await this.query.findOneById(this.repository, xero_invoice_id, relations)
	}

	async syncInvoice(invoice: XeroInvoice): Promise<XeroInvoice> {
		const domain = 'app::xero_cc::invoice::syncInvoice'

		let xero_response: Invoice

		try {
			if (Env.IsTest()) {
				this.logger.verbose(`[${domain}][Test] Mock xero invoice`)
				xero_response = invoiceMock()
			} else {
				this.logger.debug(`[${domain}] Get xero invoice`)
				const xero = await this.authService.accessToken()
				const response = await xero.accountingApi.getInvoices('', undefined, undefined, undefined, [
					invoice.ext_invoice_id,
				])
				if (!response.body.invoices?.length) {
					this.logger.error(`[${domain}] Xero invoice not in the response body`, response.body)
					throw new Error('Xero invoice not in the response body')
				}
				xero_response = response.body.invoices[0]
				this.logger.debug(`[${domain}] Create xero invoice response:`, xero_response)
			}

			if (!xero_response.invoiceID) {
				this.logger.error(`[${domain}] Xero invoiceID not in the response`)
				throw new Error('Xero invoiceID not in the response')
			}

			return await this.query.create(this.repository, {
				xero_invoice_id: invoice.xero_invoice_id,
				amount_due: xero_response.amountDue,
				amount_paid: xero_response.amountPaid,
			})
		} catch (err) {
			const e = err as Error
			this.logger.error(`Error: ${e.message}`, {
				error: {
					message: e.message,
					stack: e.stack,
				},
				request: {
					invoice: invoice,
				},
			})
			throw e
		}
	}
}
