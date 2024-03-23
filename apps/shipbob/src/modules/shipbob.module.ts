import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShipbobLocationsModule } from './locations/locations.module'
import { ShipbobInstallationService } from './shipbob.installation'
import { ShipbobProductsModule } from './products/products.module'

@Module({
	imports: [
		forwardRef(() => AppsModule),
		forwardRef(() => ShipbobLocationsModule),
		forwardRef(() => ShipbobProductsModule),
	],
	providers: [ShipbobInstallationService, Logger],
})
export class ShipbobModule {}
