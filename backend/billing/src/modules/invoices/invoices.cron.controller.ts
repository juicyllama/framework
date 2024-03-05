import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards, forwardRef, Inject } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import {
	CRON_BILLING_INVOICES_GENERATE_DOMAIN,
	CRON_BILLING_INVOICES_RESEND_DOMAIN,
	CRON_BILLING_INVOICES_SETTLE_DOMAIN,
} from './invoices.constants'
import { InvoicesCronService } from './invoices.crons.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('billing/invoices/crons')
export class InvoicesCronsController {
	constructor(
		@Inject(forwardRef(() => InvoicesCronService)) private readonly invoicesCronService: InvoicesCronService) {}

	@Post('generate')
	async generate_invoices() {
		return await CronRunner(CRON_BILLING_INVOICES_GENERATE_DOMAIN, this.invoicesCronService.generateInvoices())
	}

	@Post('resend')
	async generate_resend() {
		return await CronRunner(CRON_BILLING_INVOICES_RESEND_DOMAIN, this.invoicesCronService.resendInvoices())
	}

	@Post('settle')
	async settle_invoices() {
		return await CronRunner(CRON_BILLING_INVOICES_SETTLE_DOMAIN, this.invoicesCronService.settleInvoices())
	}
}
