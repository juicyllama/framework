import { cacheConfig, databaseConfig } from '@juicyllama/core'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AmazonSellerModule } from '../modules/amazon.seller.module'
import { OrdersController } from './orders.controller'
import { Logger } from '@juicyllama/utils'
import { InstalledAppsModule } from '@juicyllama/app-store'

@Module({
	imports: [
		AmazonSellerModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		CacheModule.registerAsync(cacheConfig()),
		AmazonSellerModule,
		InstalledAppsModule,
	],
	providers: [Logger],
	controllers: [OrdersController],
})
export class SandboxModule {}
