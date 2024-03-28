import { OAuthModule } from '@juicyllama/app-store'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyOrdersService } from './orders.service'

@Module({
	imports: [forwardRef(() => OAuthModule), forwardRef(() => ShopifyProviderModule)],
	controllers: [],
	providers: [ShopifyOrdersService, Logger],
	exports: [ShopifyOrdersService],
})
export class ShopifyOrdersModule {}
