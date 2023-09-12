import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger, Api } from '@juicyllama/utils'
import { WiseStatementService } from './wise.statement.service'
import { WiseTransaction } from './wise.statement.entity'

@Module({
	imports: [TypeOrmModule.forFeature([WiseTransaction])],
	controllers: [],
	providers: [WiseStatementService, Logger, Api],
	exports: [WiseStatementService],
})
export class WiseStatementModule {}
