import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TransactionItem } from './items.entity'
import { TransactionItemsService } from './items.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([TransactionItem]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [],
	providers: [TransactionItemsService, Logger, Query],
	exports: [TransactionItemsService],
})
export class TransactionItemsModule {}
