import { CronGuard, CronRunner } from '@juicyllama/core'
import { Controller, Post, UseGuards, forwardRef, Inject } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import { TransactionsCronSyncService } from './transactions.cron.service'
import { CRON_ECOMMERCE_TRANSACTIONS_SYNC_DOMAIN } from './transactions.constants'

@UseGuards(CronGuard)
@ApiExcludeController()
@Controller('crons/ecommerce/transactions')
export class TransactionsCronController {
	constructor(
		@Inject(forwardRef(() => TransactionsCronSyncService))
		readonly syncTransactionsCronService: TransactionsCronSyncService,
	) {}

	@Post('sync')
	async syncOrders() {
		return await CronRunner(
			CRON_ECOMMERCE_TRANSACTIONS_SYNC_DOMAIN,
			this.syncTransactionsCronService.cronSyncTransactions(),
		)
	}
}
