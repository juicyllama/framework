import { InstalledAppsModule } from '@juicyllama/app-store'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyCustomersController } from './customers.controller'
import { ShopifyCustomersService } from './customers.service'

@Module({
	imports: [forwardRef(() => InstalledAppsModule), forwardRef(() => StoresModule)],
	controllers: [ShopifyCustomersController],
	providers: [ShopifyCustomersService, Logger],
	exports: [ShopifyCustomersService],
})
export class ShopifyCustomersModule {}
