import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards, Inject, forwardRef } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN } from './subscriptions.constants'
import { SubscriptionsCronService } from './subscriptions.crons.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('/billing/subscriptions/crons')
export class SubscriptionsCronController {
	constructor(
		@Inject(forwardRef(() => SubscriptionsCronService)) private readonly subscriptionsCronService: SubscriptionsCronService) {}

	@Post('rebill')
	async rebill() {
		return await CronRunner(CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN, this.subscriptionsCronService.rebill())
	}
}
