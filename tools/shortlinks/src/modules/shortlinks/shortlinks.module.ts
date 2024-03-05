import {
	AccountModule,
	AuthModule,
	BeaconModule,
	ConfigValidationModule,
	MiddlewareAccountId,
	Query
} from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShortlinksConfigDto } from '../../config/shortlinks.config.dto'
import { ShortlinkClicksModule } from './clicks'
import { ShortlinksController } from './shortlinks.controller'
import { Shortlink } from './shortlinks.entity'
import { ShortlinksService } from './shortlinks.service'

@Module({
	imports: [
		ConfigValidationModule.register(ShortlinksConfigDto),
		TypeOrmModule.forFeature([Shortlink]),
		forwardRef(() => AccountModule),
		forwardRef(() => AuthModule),
		forwardRef(() => BeaconModule),
		forwardRef(() => ShortlinkClicksModule),
	],
	controllers: [ShortlinksController],
	providers: [ShortlinksService, Logger, Query],
	exports: [ShortlinksService],
})
export class ShortlinksModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
