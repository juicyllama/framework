import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import OpenAI from 'openai'
import { OpenAiConfigDto } from '../configs/openai.config.dto'
import { OpenaiService } from './openai.service'
import { OpenAIClientToken } from './openai.constants'
//import { OpenaiSqlService } from './sql/openai.sql.service'

@Module({
	imports: [ConfigValidationModule.register(OpenAiConfigDto)],
	controllers: [],
	providers: [
		OpenaiService,
		Logger,
		{
			provide: OpenAIClientToken,
			inject: [getConfigToken(OpenAiConfigDto)],
			useFactory: (config: OpenAiConfigDto) => {
				return new OpenAI({ apiKey: config.OPENAI_API_KEY })
			},
		},
	],
	exports: [OpenaiService],
})
export class OpenaiModule {}
