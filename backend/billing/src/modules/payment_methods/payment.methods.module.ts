import { AccountModule, AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PaymentMethodsController } from './payment.methods.controller'
import { PaymentMethod } from './payment.methods.entity'
import { PaymentMethodsService } from './payment.methods.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([PaymentMethod]), 
		forwardRef(() => AuthModule), 
		forwardRef(() => AccountModule), 
		forwardRef(() => BeaconModule)
	],
	controllers: [PaymentMethodsController],
	providers: [PaymentMethodsService, Logger, Query],
	exports: [PaymentMethodsService],
})
export class PaymentMethodsModule {}
