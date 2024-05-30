import { Module, forwardRef } from '@nestjs/common'
import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { ActivityService } from './activity.service'
import { Activity } from './activity.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Logger } from '@juicyllama/utils'
import { ActivityController } from './activity.controller'

@Module({
	imports: [TypeOrmModule.forFeature([Activity]), forwardRef(() => AuthModule), forwardRef(() => BeaconModule)],
	controllers: [ActivityController],
	providers: [ActivityService, Logger, Query],
	exports: [ActivityService],
})
export class ActivityModule {}
