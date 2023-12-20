import { Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { CustomerModule } from './customer/customer.module'
import { MandateModule } from './mandate/mandate.module'
import { PaymentModule } from './payment/payment.module'
import { MollieService } from './mollie.service'
import { AccountModule, Query } from '@juicyllama/core'

@Module({
	imports: [AccountModule, CustomerModule, MandateModule, PaymentModule],
	controllers: [],
	providers: [MollieService, Logger, Query],
	exports: [MollieService],
})
export class MollieModule {}
