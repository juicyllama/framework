import { Module, forwardRef } from '@nestjs/common'
import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { ConnectionService } from './connection.service'
import { Connection } from './connection.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { ConnectionController } from './connection.controller'

@Module({
	imports: [TypeOrmModule.forFeature([Connection]), forwardRef(() => AuthModule), forwardRef(() => BeaconModule)],
	controllers: [ConnectionController],
	providers: [ConnectionService, Logger, Query],
	exports: [ConnectionService],
})
export class ConnectionModule {}
