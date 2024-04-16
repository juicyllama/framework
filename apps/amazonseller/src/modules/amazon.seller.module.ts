import { forwardRef, Module } from '@nestjs/common'
import { AppsModule, InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { Logger, Api } from '@juicyllama/utils'
import { AmazonSellerInstallationService } from './amazon.seller.installation'
import { AmazonSellerOauthController } from './auth/amazon.seller.oauth.controller'
import { AmazonSellerAuthService } from './auth/amazon.seller.oauth.service'
import { AmazonSellerOrdersService } from './orders/amazon.seller.orders.service'

@Module({
	imports: [forwardRef(() => AppsModule), forwardRef(() => OAuthModule), forwardRef(() => InstalledAppsModule)],
	controllers: [AmazonSellerOauthController],
	providers: [AmazonSellerInstallationService, AmazonSellerAuthService, AmazonSellerOrdersService, Logger, Api],
	exports: [AmazonSellerAuthService, AmazonSellerOrdersService],
})
export class AmazonSellerModule {}
