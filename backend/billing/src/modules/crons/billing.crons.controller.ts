import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { BillingCronService } from './billing.crons.service'
import { CronGuard, CronRunner } from '@juicyllama/core'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('crons/billing')
export class BillingCronsController {
	constructor(
		@Inject(forwardRef(() => BillingCronService)) private readonly billingCronService: BillingCronService,
	) {}

	@Post('subscriptions/rebill')
	async rebill() {
		const domain = 'cron::billing::rebill'
		return await CronRunner(domain, this.billingCronService.rebill())
	}

	@Post('invoices/generate')
	async generate_invoices() {
		const domain = 'cron::billing::generate_invoices'
		return await CronRunner(domain, this.billingCronService.generateInvoices())
	}

	@Post('invoices/resend')
	async generate_resend() {
		const domain = 'cron::billing::generate_resend'
		return await CronRunner(domain, this.billingCronService.resendInvoices())
	}

	@Post('invoices/settle')
	async settle_invoices() {
		const domain = 'cron::billing::settle_invoices'
		return await CronRunner(domain, this.billingCronService.settleInvoices())
	}

	@Post('balance/settle')
	async settle_invoice() {
		const domain = 'cron::billing::settle_invoice'
		return await CronRunner(domain, this.billingCronService.settleBalances())
	}

	@Post('withdrawals/settle')
	async settle_withdrawals() {
		const domain = 'cron::billing::settle_withdrawals'
		return await CronRunner(domain, this.billingCronService.settleWithdrawals())
	}
}
