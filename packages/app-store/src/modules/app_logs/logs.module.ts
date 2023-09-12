import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { Log } from './logs.entity'
import { LogsService } from './logs.service'
import { InstalledAppsModule } from '../installed/installed.module'
import { BeaconModule, Query } from '@juicyllama/core'

@Module({
	imports: [TypeOrmModule.forFeature([Log]), forwardRef(() => BeaconModule), forwardRef(() => InstalledAppsModule)],
	controllers: [],
	providers: [LogsService, Logger, Query],
	exports: [LogsService],
})
export class LogsModule {}
