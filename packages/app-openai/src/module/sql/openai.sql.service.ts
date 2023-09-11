import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import { OpenAiConvertNLtoSQLTypes } from '../openai.enums'
import { RepositoriesToOpenAISQLSchema } from './openai.sql.mappers'
import type { CreateCompletionRequest } from 'openai'

@Injectable()
export class OpenaiSqlService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
	) {}

	async convertNLtoSQL(repos: Repository<any>[], query: string, type: OpenAiConvertNLtoSQLTypes): Promise<string> {
		const domain = 'app-openai::convertNLtoSQL'

		const model = 'code-davinci-002'
		let prompt = RepositoriesToOpenAISQLSchema(repos)

		switch (type) {
			case OpenAiConvertNLtoSQLTypes.SELECT:
				prompt += `An query to find ${query} \n SELECT`
				break
		}

		const request: CreateCompletionRequest = {
			model: model,
			prompt: prompt,
			//max_tokens: 2000,
			temperature: 0,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
			//best_of: 3,
			stop: ['/n', ';'],
		}

		const completion = await this.api.post(domain, `https://api.openai.com/v1/completions`, request, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${this.configService.get<string>('openai.OPENAI_API_KEY')}`,
			},
		})

		if (completion) {
			let sql: string

			switch (type) {
				case OpenAiConvertNLtoSQLTypes.SELECT:
					sql = completion.choices[0]?.text
					break
			}

			return sql
		}

		return
	}
}
