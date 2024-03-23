import { AppsModule } from '@juicyllama/app-store'
import { AccountModule, AuthModule, BeaconModule, jwtConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { WebsitesModule } from '@juicyllama/websites'
import { Module, forwardRef } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { StoresController } from './stores.controller'
import { Store } from './stores.entity'
import { StoresService } from './stores.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Store]),
		JwtModule.register(jwtConfig()),
		forwardRef(() => AuthModule),
		forwardRef(() => AccountModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => WebsitesModule),
		forwardRef(() => AppsModule),
	],
	controllers: [StoresController],
	providers: [StoresService, Logger, Query],
	exports: [StoresService],
})
export class StoresModule {}
