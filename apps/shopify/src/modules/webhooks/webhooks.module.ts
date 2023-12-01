import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ShopifyWebhooksService } from './webhooks.service'
import { ShopifyWebhooksController } from './webhooks.controller'
import { ShopifyProviderModule } from '../provider/provider.module'

@Module({
	imports: [OAuthModule, InstalledAppsModule, ShopifyProviderModule],
	controllers: [ShopifyWebhooksController],
	providers: [ShopifyWebhooksService, Logger],
	exports: [ShopifyWebhooksService],
})
export class ShopifyWebhooksModule {}
