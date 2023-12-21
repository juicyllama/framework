import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { WiseStatementModule } from './statement/wise.statement.module'
import { WiseBalanceService } from './wise.balance.service'

@Module({
	imports: [WiseStatementModule],
	controllers: [],
	providers: [WiseBalanceService, Logger],
	exports: [WiseBalanceService],
})
export class WiseBalanceModule {}
