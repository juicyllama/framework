import { BeaconModule, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortlinkClick } from './clicks.entity'
import { ShortlinkClicksService } from './clicks.service'

@Module({
	imports: [TypeOrmModule.forFeature([ShortlinkClick]), forwardRef(() => BeaconModule)],
	controllers: [],
	providers: [ShortlinkClicksService, Logger, Query],
	exports: [ShortlinkClicksService],
})
export class ShortlinkClicksModule {}
