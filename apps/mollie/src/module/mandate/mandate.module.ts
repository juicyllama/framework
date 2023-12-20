import { Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerModule } from '../customer/customer.module'
import { MollieProviderModule } from '../provider'
import { MollieMandate } from './mandate.entity'
import { MandateService } from './mandate.service'

@Module({
	imports: [TypeOrmModule.forFeature([MollieMandate]), CustomerModule, MollieProviderModule],
	controllers: [],
	providers: [MandateService, Logger, Query],
	exports: [MandateService],
})
export class MandateModule {}
