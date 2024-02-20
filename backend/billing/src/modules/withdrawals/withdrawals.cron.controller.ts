import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN } from './withdrawals.constants'
import { WithdrawalsCronService } from './withdrawals.crons.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('billing/withdrawals/crons')
export class WithdrawalsCronsController {
	constructor(private readonly withdrawalsCronService: WithdrawalsCronService) {}

	@Post('settle')
	async settle_withdrawals() {
		return await CronRunner(CRON_BILLING_WITHDRAWALS_SETTLE_DOMAIN, this.withdrawalsCronService.settleWithdrawals())
	}
}
