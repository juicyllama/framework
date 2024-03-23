import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Stock } from './stock.entity'
import { StockService } from './stock.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Stock]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [],
	providers: [StockService, Logger, Query],
	exports: [StockService],
})
export class StockModule {}
