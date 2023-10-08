import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { StoresService } from './stores.service'
import { StoresController } from './stores.controller'
import { ConfigModule } from '@nestjs/config'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
} from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Store } from './stores.entity'
import { WebsitesModule } from '@juicyllama/websites'
import { AppsModule } from '@juicyllama/app-store'

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
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => WebsitesModule),
		forwardRef(() => AppsModule),
	],
	controllers: [StoresController],
	providers: [
		StoresService,
		Logger,
		Query,
	],
	exports: [StoresService],
})
export class StoresModule {}
