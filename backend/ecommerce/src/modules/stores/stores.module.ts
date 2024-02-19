import { AppsModule } from '@juicyllama/app-store'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { WebsitesModule } from '@juicyllama/websites'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresController } from './stores.controller'
import { Store } from './stores.entity'
import { StoresService } from './stores.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Store]),
		JwtModule.register(jwtConfig()),
		AuthModule,
		AccountModule,
		BeaconModule,
		WebsitesModule,
		AppsModule,
	],
	controllers: [StoresController],
	providers: [StoresService, Logger, Query],
	exports: [StoresService],
})
export class StoresModule {}
