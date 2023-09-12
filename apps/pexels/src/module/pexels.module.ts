import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment } from '@juicyllama/utils'
import { PexelsService } from './pexels.service'
import Joi from 'joi'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import pexelsConfig from '../configs/pexels.config'
import { pexelsConfigJoi } from '../configs/pexels.config.joi'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [pexelsConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(pexelsConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [PexelsService, Logger, Api],
	exports: [PexelsService],
})
export class PexelsModule {}
