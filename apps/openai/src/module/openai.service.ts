import { Logger } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'
import { DeepPartial } from 'typeorm'
import { InjectOpenAI } from './openai.constants'

@Injectable()
export class OpenaiService {
	constructor(
		private readonly logger: Logger,
		@InjectOpenAI() private readonly client: OpenAI,
	) {}

	async ask(
		options: DeepPartial<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming>,
	): Promise<OpenAI.Chat.ChatCompletion> {
		const domain = 'app::openai::ask'

		this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)

		const params = options as OpenAI.Chat.ChatCompletionCreateParamsNonStreaming

		if (!params.model) {
			params.model = 'gpt-3.5-turbo-1106'
		}

		try {
			const chatCompletion = (await this.client.chat.completions.create(params)) as OpenAI.Chat.ChatCompletion
			this.logger.debug(`[${domain}] Response: ${JSON.stringify(chatCompletion, null, 2)}`)
			return chatCompletion
		} catch (e) {
			this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response)
		}
	}

	// async sql(repos: Repository<any>[], query: string, type: OpenAiConvertNLtoSQLTypes) {
	// 	return await this.openaiSqlService.convertNLtoSQL(repos, query, type)
	// }

	// async image(options: CreateImageRequest): Promise<ImagesResponse> {
	// 	const domain = 'app::openai::image'

	// 	try {
	// 		const configuration = new Configuration({
	// 			apiKey: this.configService.get<string>('openai.OPENAI_API_KEY'),
	// 		})

	// 		const openai = new OpenAIApi(configuration)

	// 		this.logger.debug(`[${domain}] Request: ${JSON.stringify(options, null, 2)}`)
	// 		const result = await openai.createImage(options)
	// 		this.logger.debug(`[${domain}] Response: ${JSON.stringify(result.data, null, 2)}`)
	// 		return result.data
	// 	} catch (e) {
	// 		this.logger.warn(`[${domain}] Error: ${JSON.stringify(e.message, null, 2)}`, e.response)
	// 	}
	// }

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
