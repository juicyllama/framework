import { ConfigModule } from '@nestjs/config'
import { Api, Enviroment } from '@juicyllama/utils'
import { OpenaiService } from './openai.service'
import Joi from 'joi'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import openaiConfig from '../configs/openai.config'
import { openaiConfigJoi } from '../configs/openai.config.joi'
import { OpenaiSqlService } from './sql/openai.sql.service'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [openaiConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: process.env.NODE_ENV !== Enviroment.test ? Joi.object(openaiConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [OpenaiService, OpenaiSqlService, Logger, Api],
	exports: [OpenaiService],
})
export class OpenaiModule {}
