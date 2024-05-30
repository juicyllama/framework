import { Points } from './points.entity'
import { Module, forwardRef } from '@nestjs/common'
import { AuthModule, BeaconModule, Query } from '@juicyllama/core'
import { PointsService } from './points.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PointLog } from './log/points.log.entity'
import { Logger } from '@juicyllama/utils'
import { PointsController } from './points.controller'
import { PointLogService } from './log/points.log.service'

@Module({
	imports: [
		TypeOrmModule.forFeature([Points, PointLog]),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
	],
	controllers: [PointsController],
	providers: [PointsService, PointLogService, Logger, Query],
	exports: [PointsService, PointLogService],
})
export class PointsModule {}
