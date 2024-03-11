import { AuthModule, FxModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Invoice } from '../..'
import { ChargesController } from './charges.controller'
import { Charge } from './charges.entity'
import { ChargesService } from './charges.service'
import { ChargesSubscriber } from './charges.subscriber'

@Module({
	imports: [TypeOrmModule.forFeature([Charge, Invoice]), forwardRef(() => AuthModule), forwardRef(() => FxModule)],
	controllers: [ChargesController],
	providers: [ChargesService, ChargesSubscriber, Logger, Query],
	exports: [ChargesService],
})
export class ChargesModule {}
