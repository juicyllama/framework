import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Api, Env, Logger } from '@juicyllama/utils'
import Joi from 'joi'
import { WordpressMediaService } from './wordpress.media.service'
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
	providers: [WordpressMediaService, Logger, Api],
	exports: [WordpressMediaService],
})
export class WordpressMediaModule {}
