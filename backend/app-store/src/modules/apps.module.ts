import { Query, BeaconModule, AuthModule, systemConfig } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppsController } from './apps.controller'
import { App } from './apps.entity'
import { AppsService } from './apps.service'

@Module({
	imports: [ConfigModule.forFeature(systemConfig), TypeOrmModule.forFeature([App]), AuthModule, BeaconModule],
	controllers: [AppsController],
	providers: [AppsService, Logger, Query],
	exports: [AppsService],
})
export class AppsModule {}
