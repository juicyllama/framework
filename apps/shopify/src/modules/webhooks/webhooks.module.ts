import { InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyWebhooksService } from './webhooks.service'
import { ShopifyWebhooksController } from './webhooks.controller'
import { ShopifyProviderModule } from '../provider/provider.module'

@Module({
	imports: [
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => ShopifyProviderModule),
	],
	controllers: [ShopifyWebhooksController],
	providers: [ShopifyWebhooksService, Logger],
	exports: [ShopifyWebhooksService],
})
export class ShopifyWebhooksModule {}
