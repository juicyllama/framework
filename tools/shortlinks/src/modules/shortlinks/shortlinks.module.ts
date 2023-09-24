import { forwardRef, MiddlewareConsumer, Module } from '@nestjs/common'
import { Env, Logger } from '@juicyllama/utils'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AccountModule, AuthModule, BeaconModule, databaseConfig, MiddlewareAccountId, Query } from '@juicyllama/core'
import { Shortlink } from './shortlinks.entity.js'
import { ShortlinksService } from './shortlinks.service.js'
import Joi from 'joi'
import config from '../../config/config.js'
import { configJoi } from '../../config/config.joi.js'
import { ShortlinksController } from './shortlinks.controller.js'
import { ConfigModule } from '@nestjs/config'
import { ShortlinkClicksModule } from './clicks/clicks.module.js'
import { ShortlinksRedirectService } from './shortlinks.redirect.service.js'
import { ShortlinksShortenService } from './shortlinks.shorten.service.js'

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
	providers: [ShortlinksService, ShortlinksRedirectService, ShortlinksShortenService, Logger, Query],
	exports: [ShortlinksService, ShortlinksRedirectService, ShortlinksShortenService],
})
export class ShortlinksModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(MiddlewareAccountId)
	}
}
