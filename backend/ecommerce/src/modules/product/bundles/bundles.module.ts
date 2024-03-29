import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Bundle } from './bundles.entity'
import { BundlesService } from './bundles.service'
import { BundleSkus } from './bundles.skus.entity'

@Module({
	imports: [
		TypeOrmModule.forFeature([Bundle, BundleSkus]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [],
	providers: [BundlesService, Logger, Query],
	exports: [BundlesService],
})
export class BundlesModule {}
