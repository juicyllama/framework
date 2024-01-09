import { Controller, forwardRef, Inject, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CronGuard, CronRunner } from '@juicyllama/core'
import { WithdrawalsCronService } from './withdrawals.crons.service'
import { CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN } from './withdrawals.constants'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('billing/withdrawals/crons')
export class WithdrawalsCronsController {
	constructor(
		@Inject(forwardRef(() => WithdrawalsCronService))
		private readonly withdrawalsCronService: WithdrawalsCronService,
	) {}

	@Post('settle')
	async settle_withdrawals() {
		return await CronRunner(CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN, this.withdrawalsCronService.settleWithdrawals())
	}
}
