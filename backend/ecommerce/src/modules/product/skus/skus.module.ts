import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Sku } from './sku.entity'
import { SkusService } from './skus.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Sku]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [],
	providers: [SkusService, Logger, Query],
	exports: [SkusService],
})
export class SkusModule {}
