import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ShipbobLocationsService } from './locations.service'

@Module({
	imports: [],
	providers: [ShipbobLocationsService, Logger, Api],
	exports: [ShipbobLocationsService],
})
export class ShipbobLocationsModule {}
