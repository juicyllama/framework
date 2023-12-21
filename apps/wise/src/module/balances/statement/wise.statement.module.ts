import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { WiseTransaction } from './wise.statement.entity'
import { WiseStatementService } from './wise.statement.service'

@Module({
	imports: [TypeOrmModule.forFeature([WiseTransaction])],
	controllers: [],
	providers: [WiseStatementService, Logger],
	exports: [WiseStatementService],
})
export class WiseStatementModule {}
