import { Module } from '@nestjs/common'
import { TaxService } from './tax.service'
import { Query } from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tax } from './tax.entity'

@Module({
	imports: [TypeOrmModule.forFeature([Tax])],
	controllers: [],
	providers: [TaxService, Query],
	exports: [TaxService],
})
export class TaxModule {}
