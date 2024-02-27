import { BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Log } from './logs.entity'
import { LogsService } from './logs.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Log]), 
		forwardRef(() => BeaconModule)
	],
	controllers: [],
	providers: [LogsService, Logger, Query],
	exports: [LogsService],
})
export class LogsModule {}
