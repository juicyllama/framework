import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountModule, databaseConfig } from '@juicyllama/core'
import { AppsModule, InstalledAppsModule } from '@juicyllama/app-store'

import { GoogleAnalyticsModule } from '../modules/google-analytics.module'
import { SandboxController } from './sandbox.controller'

@Module({
	imports: [
		GoogleAnalyticsModule,
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRoot(databaseConfig()),
		AccountModule,
		AppsModule,
		InstalledAppsModule,
	],
	controllers: [SandboxController],
})
export class SandboxModule {}
