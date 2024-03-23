import { InstalledAppsModule } from '@juicyllama/app-store'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyShopController } from './shop.controller'
import { ShopifyShopService } from './shop.service'

@Module({
	imports: [
		forwardRef(() => InstalledAppsModule), 
		forwardRef(() => StoresModule)
	],
	controllers: [ShopifyShopController],
	providers: [ShopifyShopService, Logger],
	exports: [ShopifyShopService],
})
export class ShopifyShopModule {}
