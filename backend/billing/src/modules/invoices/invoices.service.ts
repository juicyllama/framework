import { XeroService } from '@juicyllama/app-xero-cc'
import {
	AccountService,
	AppIntegrationName,
	BaseService,
	Query,
	StorageService,
	//StorageType,
	//User,
} from '@juicyllama/core'
import { Logger, Modules } from '@juicyllama/utils'
import { Inject, Injectable } from '@nestjs/common'
import { LazyModuleLoader } from '@nestjs/core'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'
import { toXeroInvoice } from './invoice.mapper.xero'
import { Invoice } from './invoices.entity'

const E = Invoice
type T = Invoice
@Injectable()
export class InvoicesService extends BaseService<T> {
	constructor(
		@Inject(Query) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		private readonly accountService: AccountService,
		private readonly logger: Logger,
		readonly storageService: StorageService,
		private readonly lazyModuleLoader: LazyModuleLoader,
	) {
		super(query, repository)
	}

	async create(data: DeepPartial<T>): Promise<T> {
		let invoice = await super.create(data)
		invoice = await this.xeroCreateInvoice(invoice)
		return invoice
	}

	async addPayment(invoice: T, amount: number): Promise<T> {
		invoice.amount_paid = Number(invoice.amount_paid) + Number(amount)

		await this.xeroAddPayment(invoice, amount)

		return await this.query.update(this.repository, {
			invoice_id: invoice.invoice_id,
			amount_paid: invoice.amount_paid,
		})
	}

	async getUnpaid(): Promise<T[]> {
		const sql = `SELECT *
                   FROM billing_invoices
                   WHERE amount_paid < amount_total;`
		const invoices = await this.query.raw(this.repository, sql)
		for (const i in invoices) {
			invoices[i].account = await this.accountService.findById(invoices[i].account_id)
		}
		return invoices
	}

	async retryPostingInvoice(invoice: T): Promise<T> {
		return await this.xeroCreateInvoice(invoice)
	}

	async xeroCreateInvoice(invoice: T): Promise<T> {
		const domain = 'cron::billing::invoices::xeroCreateInvoice'

		if (Modules.xerocc.isInstalled) {
			this.logger.debug(`[${domain}] Xero installed, create xero invoice for #${invoice.invoice_id}`, invoice)

			const { XeroModule, XeroService } = await Modules.xerocc.load()

			try {
				const xeroModule = await this.lazyModuleLoader.load(() => XeroModule)
				const xeroService = xeroModule.get<XeroService>(XeroService)

				const lineItems = []

				for (const charge of invoice.charges ?? []) {
					let accountCode = process.env.XERO_CC_DEFAULT_ACCOUNT_CODE
					let taxType = 'NONE'

					if (charge.tags?.length) {
						accountCode = await xeroService.getAccountCode(charge.tags[0])
						taxType = await xeroService.getTaxType(charge.tags[0])
					}

					lineItems.push({
						code: charge.tags?.[0] ?? 'MISC',
						name: charge.name,
						description: charge.description,
						quantity: 1,
						unitAmount: charge.amount_subtotal,
						accountCode: accountCode,
						taxAmount: charge.amount_tax,
						//lineAmount: charge.amount_total,
						taxType: taxType,
					})
				}

				if (!invoice.account) {
					invoice.account = await this.accountService.findById(invoice.account_id)
				}

				const xeroInvoice = toXeroInvoice({
					account: invoice.account,
					currency: invoice.currency,
					amount_subtotal: invoice.amount_subtotal || 0,
					amount_tax: invoice.amount_tax || 0,
					amount_total: invoice.amount_total,
					lineItems: lineItems,
					invoice_date: invoice.created_at || new Date(),
				})

				const app_invoice = await xeroService.createInvoice({
					account: invoice.account,
					invoice: xeroInvoice,
					email: true,
				})

				if (app_invoice.xero_invoice_id) {
					invoice = await this.query.update(this.repository, {
						invoice_id: invoice.invoice_id,
						app_integration_name: AppIntegrationName.xero_cc,
						app_invoice_id: app_invoice.xero_invoice_id,
					})
				}
			} catch (e) {
				const error = e as Error
				this.logger.error(`[${domain}] Error: ${error.message}`, error)
			}
		}

		return invoice
	}

	async xeroAddPayment(invoice: T, amount: number): Promise<void> {
		const domain = 'cron::billing::invoices::xeroAddPayment'

		if (Modules.xerocc.isInstalled) {
			const { XeroModule, XeroService } = await Modules.xerocc.load()

			try {
				const xeroModule = await this.lazyModuleLoader.load(() => XeroModule)
				const xeroService = xeroModule.get(XeroService)
				await xeroService.createInvoicePayment(invoice.app_invoice_id, amount)
			} catch (e) {
				const error = e as Error
				this.logger.error(`[${domain}] Error: ${error.message}`, error)
			}
		}
	}

	// TODO: this is not correct, shoudl be saved by account not user
	// async downloadInvoice(user: User, invoice_id: number): Promise<T | undefined> {
	// 	const file = await this.storageService.read(`/accounts/}invoices/${user.user_id}/${invoice_id}`, StorageType.PRIVATE)
	// 	return file
	// }
}
