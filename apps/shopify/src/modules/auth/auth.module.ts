import { AppsModule, InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { AuthModule, ConfigValidationModule, jwtConfig } from '@juicyllama/core'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyAuthController } from './auth.controller'
import { ShopifyConfigDto } from '../../config/shopify.config.dto'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		AuthModule,
		AppsModule,
		OAuthModule,
		InstalledAppsModule,
		StoresModule,
		ShopifyProviderModule,
		ConfigValidationModule.register(ShopifyConfigDto),
	],
	controllers: [ShopifyAuthController],
	providers: [Logger],
	exports: [],
})
export class ShopifyAuthModule {}
