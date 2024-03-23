import { AppsModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyAuthModule } from './auth/auth.module'
import { ShopifyOrdersModule } from './orders/orders.module'
import { ShopifyProviderModule } from './provider/provider.module'
import { ShopifyInstallationService } from './shopify.installation'
import { ShopifyWebhooksModule } from './webhooks/webhooks.module'

@Module({
	imports: [
		forwardRef(() => AppsModule), 
		forwardRef(() => ShopifyAuthModule), 
		forwardRef(() => ShopifyOrdersModule), 
		forwardRef(() => ShopifyWebhooksModule), 
		forwardRef(() => ShopifyProviderModule)
	],
	providers: [ShopifyInstallationService, Logger],
	exports: [ShopifyProviderModule],
})
export class ShopifyModule {}
