import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards, forwardRef, Inject } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { CRON_BILLING_WALLET_SETTLE_BALANCES_DOMAIN } from './wallet.constants'
import { WalletCronService } from './wallet.crons.service'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('/billing/wallet/crons')
export class WalletCronsController {
	constructor(
		@Inject(forwardRef(() => WalletCronService)) private readonly walletCronService: WalletCronService) {}

	@Post('settle')
	async settle_invoice() {
		return await CronRunner(CRON_BILLING_WALLET_SETTLE_BALANCES_DOMAIN, this.walletCronService.settleBalances())
	}
}
