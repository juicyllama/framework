import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { databaseConfig } from '@juicyllama/core'
import { GoogleAnalyticsModule } from '../modules/google-analytics.module'

@Module({
	imports: [
		GoogleAnalyticsModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(databaseConfig()),
	],
})
export class SandboxModule {}
