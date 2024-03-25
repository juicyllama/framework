import { Api, Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ShipbobProductsService } from './products.service'

@Module({
	imports: [],
	providers: [ShipbobProductsService, Logger, Api],
	exports: [ShipbobProductsService],
})
export class ShipbobProductsModule {}
