import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { OpenaiSqlService } from './sql/openai.sql.service'
import { OpenAiConvertNLtoSQLTypes } from './openai.enums'
import { CreateChatCompletionRequest, Configuration, OpenAIApi, CreateImageRequest } from 'openai'
import { Repository } from 'typeorm'
import { CreateChatCompletionResponse, ImagesResponse } from 'openai/api'

@Injectable()
export class OpenaiService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => OpenaiSqlService)) private readonly openaiSqlService: OpenaiSqlService,
		@Inject(forwardRef(() => Api)) private readonly api: Api,
	) {}

	async ask(options: CreateChatCompletionRequest): Promise<CreateChatCompletionResponse> {
		const domain = 'app::openai::ask'

		this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)

		if (!options.model) {
			options.model = 'gpt-3.5-turbo'
		}

		try {
			const configuration = new Configuration({
				apiKey: this.configService.get<string>('openai.OPENAI_API_KEY'),
			})

			const openai = new OpenAIApi(configuration)
			const result = await openai.createChatCompletion(options)
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(result.data, null, 2)}`)
			return result.data
		} catch (e) {
			this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response)
		}
	}

	async sql(repos: Repository<any>[], query: string, type: OpenAiConvertNLtoSQLTypes) {
		return await this.openaiSqlService.convertNLtoSQL(repos, query, type)
	}

	async image(options: CreateImageRequest): Promise<ImagesResponse> {
		const domain = 'app::openai::image'

		try {
			const configuration = new Configuration({
				apiKey: this.configService.get<string>('openai.OPENAI_API_KEY'),
			})

			const openai = new OpenAIApi(configuration)

			this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)
			const result = await openai.createImage(options)
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(result.data, null, 2)}`)
			return result.data
		} catch (e) {
			this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response)
		}
	}

	// async train(training: [{ prompt: string; completion: string }]) {
	// 	/*	const domain = 'app-openai::trainNLtoSQL'
	//
	// 	const model = 'code-davinci-002'
	//
	//
	// 	const Blob = require("buffer").Blob;
	//
	// 	const fileName = new Date().getMilliseconds()
	//
	// 	const filBlob = new Blob([JSON.stringify(training , null, 2)], {
	// 		type: 'application/json',
	// 		lastModifiedDate: new Date(),
	// 		name: fileName.toString() + '.json'
	// 	});
	//
	// 	let upload
	//
	// 	try {
	// 		upload = await openai.createFile(new Blob(filBlob, `${fileName}.json`), 'fine-tune')
	//
	// 		const f: CreateFineTuneRequest = {
	// 			model: model,
	// 			training_file: upload.data.id
	// 		}
	//
	// 		await openai.createFineTune(f)
	//
	// 	} catch (e) {
	// 		if (e.response) {
	// 			this.logger.error(`[${domain}] Error: ${e.message} `, e.response)
	// 		} else {
	// 			this.logger.error(`[${domain}] Error: ${e.message} `, e)
	// 		}
	// 	}
	//
	//
	//  */
	// }
}
