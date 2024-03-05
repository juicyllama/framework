import { Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroAccountCode } from './account.code.entity'
import { AccountCodeService } from './account.code.service'

@Module({
	imports: [TypeOrmModule.forFeature([XeroAccountCode])],
	controllers: [],
	providers: [AccountCodeService, Query, Logger],
	exports: [AccountCodeService],
})
export class AccountCodeModule {}
