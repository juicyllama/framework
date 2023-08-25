import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { WordpressUsersService } from './wordpress.users.service'
import wordpressConfig from '../../config/wordpress.config'
import { wordpressConfigJoi } from '../../config/wordpress.config.joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [wordpressConfig],
			validationSchema: Env.IsNotTest() ? Joi.object(wordpressConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [WordpressUsersService, Logger, Api],
	exports: [WordpressUsersService],
})
export class WordpressUsersModule {}
