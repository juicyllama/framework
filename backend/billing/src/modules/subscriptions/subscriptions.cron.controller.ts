import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CronGuard, CronRunner } from '@juicyllama/core'
import { SubscriptionsCronService } from './subscriptions.crons.service'
import { CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN } from './subscriptions.constants'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('/billing/subscriptions/crons')
export class SubscriptionsCronController {
	constructor(
		@Inject(forwardRef(() => SubscriptionsCronService))
		private readonly subscriptionsCronService: SubscriptionsCronService,
	) {}

	@Post('rebill')
	async rebill() {
		return await CronRunner(CRON_BILLING_SUBSCRIPTIONS_REBILL_DOMAIN, this.subscriptionsCronService.rebill())
	}
}
