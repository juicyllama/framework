import { InstalledAppsModule } from '@juicyllama/app-store'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { ShopifyShopController } from './shop.controller'
import { ShopifyShopService } from './shop.service'

@Module({
	imports: [ScheduleModule.forRoot(), InstalledAppsModule, StoresModule],
	controllers: [ShopifyShopController],
	providers: [ShopifyShopService, Logger],
	exports: [ShopifyShopService],
})
export class ShopifyShopModule {}
