import { Query } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Tax } from './tax.entity'
import { TaxService } from './tax.service'

@Module({
	imports: [TypeOrmModule.forFeature([Tax])],
	controllers: [],
	providers: [TaxService, Query],
	exports: [TaxService],
})
export class TaxModule {}
