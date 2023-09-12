import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { Env, Logger } from '@juicyllama/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountModule, AuthModule, BeaconModule, databaseConfig, MiddlewareAccountId, Query } from '@juicyllama/core'
import { Shortlink } from './shortlinks.entity'
import { ShortlinksService } from './shortlinks.service'
import Joi from 'joi'
import config from '../../config/config'
import { configJoi } from '../../config/config.joi'
import { ShortlinksController } from './shortlinks.controller'
import { ConfigModule } from '@nestjs/config'
import { ShortlinkClicksModule } from './clicks'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [databaseConfig, config],
			validationSchema: Env.IsNotTest() ? Joi.object(configJoi) : null,
		}),
		TypeOrmModule.forRoot(databaseConfig()),
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
