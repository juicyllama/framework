import { Module } from '@nestjs/common'
import { AccountCodeService } from './account.code.service'
import { Query, Tag } from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { XeroAccountCode } from './account.code.entity'
import { Logger } from '@juicyllama/utils'

@Module({
	imports: [TypeOrmModule.forFeature([XeroAccountCode, Tag])],
	controllers: [],
	providers: [AccountCodeService, Query, Logger],
	exports: [AccountCodeService],
})
export class AccountCodeModule {}
