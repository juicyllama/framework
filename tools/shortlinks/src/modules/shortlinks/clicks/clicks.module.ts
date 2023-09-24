import { forwardRef, Module } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BeaconModule, databaseConfig, Query } from '@juicyllama/core'
import { ShortlinkClick } from './clicks.entity.js'
import { ShortlinkClicksService } from './clicks.service.js'

@Module({
	imports: [
		TypeOrmModule.forRoot(databaseConfig()),
		TypeOrmModule.forFeature([ShortlinkClick]),
		forwardRef(() => BeaconModule),
	],
	controllers: [],
	providers: [ShortlinkClicksService, Logger, Query],
	exports: [ShortlinkClicksService],
})
export class ShortlinkClicksModule {}
