import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StockLocation } from './locations.entity'
import { StockLocationsService } from './locations.service'

@Module({
	imports: [TypeOrmModule.forFeature([StockLocation]), forwardRef(() => AuthModule), forwardRef(() => BeaconModule)],
	controllers: [],
	providers: [StockLocationsService, Logger, Query],
	exports: [StockLocationsService],
})
export class StockLocationsModule {}
