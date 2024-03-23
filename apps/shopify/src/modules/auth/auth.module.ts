import { AppsModule, InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { AuthModule, ConfigValidationModule, jwtConfig } from '@juicyllama/core'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyAuthController } from './auth.controller'
import { ShopifyConfigDto } from '../../config/shopify.config.dto'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AppsModule),
		forwardRef(() => OAuthModule),
		forwardRef(() => InstalledAppsModule),
		forwardRef(() => StoresModule),
		forwardRef(() => ShopifyProviderModule),
		ConfigValidationModule.register(ShopifyConfigDto),
	],
	controllers: [ShopifyAuthController],
	providers: [Logger],
	exports: [],
})
export class ShopifyAuthModule {}
