import { databaseConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import Joi from 'joi'
import shopifyConfig from '../config/shopify.config'
import { shopifyConfigJoi } from '../config/shopify.config.joi'
import { ShopifyModule } from '../modules/shopify.module'

@Module({
	imports: [
		ShopifyModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [shopifyConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(shopifyConfigJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
	],
})
export class SandboxModule {}
