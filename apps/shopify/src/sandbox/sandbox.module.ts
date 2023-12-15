import { databaseConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import shopifyConfig from '../config/shopify.config'
import { shopifyConfigJoi } from '../config/shopify.config.joi'
import { ShopifyModule } from '../modules/shopify.module'

@Module({
	imports: [
		ShopifyModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? shopifyConfigJoi : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		ScheduleModule.forRoot(),
	],
})
export class SandboxModule {}
