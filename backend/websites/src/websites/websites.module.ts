import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { CacheModule } from '@nestjs/cache-manager'
import { WebsitesService } from './websites.service'
import { WebsitesController } from './websites.controller'
import { ConfigModule } from '@nestjs/config'
import {
	AccountModule,
	AuthModule,
	BeaconModule,
	cacheConfig,
	databaseConfig,
	jwtConfig,
	Query,
	StorageModule,
} from '@juicyllama/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Website } from './websites.entity'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [cacheConfig],
			isGlobal: true,
			envFilePath: '.env',
		}),
		CacheModule.registerAsync(cacheConfig()),
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([Website]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => StorageModule),
	],
	controllers: [WebsitesController],
	providers: [
		WebsitesService,
		Logger,
		Query,
	],
	exports: [WebsitesService],
})
export class WebsiteModule {}
