import { Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MollieProviderModule } from '../provider'
import { MollieCustomer } from './customer.entity'
import { CustomerService } from './customer.service'

@Module({
	imports: [TypeOrmModule.forFeature([MollieCustomer]), MollieProviderModule],
	controllers: [],
	providers: [CustomerService, Logger, Query],
	exports: [CustomerService],
})
export class CustomerModule {}
