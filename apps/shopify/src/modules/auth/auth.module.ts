import { AppsModule, InstalledAppsModule, OAuthModule } from '@juicyllama/app-store'
import { AuthModule, jwtConfig } from '@juicyllama/core'
import { StoresModule } from '@juicyllama/ecommerce'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { ShopifyProviderModule } from '../provider/provider.module'
import { ShopifyAuthController } from './auth.controller'

@Module({
	imports: [
		JwtModule.register(jwtConfig()),
		AuthModule,
		AppsModule,
		OAuthModule,
		InstalledAppsModule,
		StoresModule,
		ShopifyProviderModule,
	],
	controllers: [ShopifyAuthController],
	providers: [Logger],
	exports: [],
})
export class ShopifyAuthModule {}
