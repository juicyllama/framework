import { forwardRef, Module } from '@nestjs/common'
import { Logger, Api } from '@juicyllama/utils'
import { WiseBalanceService } from './wise.balance.service'
import { WiseStatementModule } from './statement/wise.statement.module'

@Module({
	imports: [forwardRef(() => WiseStatementModule)],
	controllers: [],
	providers: [WiseBalanceService, Logger, Api],
	exports: [WiseBalanceService],
})
export class WiseBalanceModule {}
