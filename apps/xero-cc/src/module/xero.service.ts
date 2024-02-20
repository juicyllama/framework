import { Account, Tag } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { Invoice } from 'xero-node'
import { AccountCodeService } from './accountCode/account.code.service'
import { ContactService } from './customer/contact.service'
import { InvoiceService } from './invoice/invoice.service'

@Injectable()
export class XeroService {
	constructor(
		private readonly accountCodeService: AccountCodeService,
		private readonly contactService: ContactService,
		private readonly invoiceService: InvoiceService,
		private readonly logger: Logger,
	) {}

	async createInvoice(options: {
		account: Account
		invoice: Invoice
		email?: boolean
	}): Promise<{ xero_invoice_id: number }> {
		const domain = 'app::xero_cc::XeroService::createInvoice'

		const contact = await this.contactService.getOrCreate(options.account)

		if (!contact?.ext_contact_id) {
			this.logger.error(`[${domain}] Contact was not created at Xero`, options)
			throw new Error('Contact not created')
		}

		const invoice_options = {
			contact: contact,
			account: options.account,
			invoice: options.invoice,
			email: options.email ?? false,
		}

		const invoice = await this.invoiceService.getOrCreate(invoice_options)

		if (!invoice?.ext_invoice_id) {
			this.logger.error(`[${domain}] Invoice was not created at Xero`, invoice_options)
			throw new Error('Invoice not created')
		}

		return { xero_invoice_id: invoice.xero_invoice_id }
	}

	async createInvoicePayment(xero_invoice_id: number, amount: number): Promise<{ xero_invoice_id: number }> {
		const invoice = await this.invoiceService.createPayment(xero_invoice_id, amount)
		return { xero_invoice_id: invoice.xero_invoice_id }
	}

	async getAccountCode(tag: Tag): Promise<string> {
		return await this.accountCodeService.getAccountCodeByTag(tag)
	}

	async getTaxType(tag: Tag): Promise<string> {
		return await this.accountCodeService.getTaxTypeByTag(tag)
	}
}
