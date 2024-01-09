import { databaseConfig } from '@juicyllama/core'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShopifyModule } from '../modules/shopify.module'

@Module({
	imports: [
		ShopifyModule,
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
		ScheduleModule.forRoot(),
	],
})
export class SandboxModule {}
