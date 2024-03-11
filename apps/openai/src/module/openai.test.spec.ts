import { Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { OpenaiService } from './openai.service'
import OpenAI from 'openai'
import { OpenAIClientToken } from './openai.constants'

describe('OpenAI', () => {
	let moduleRef: TestingModule

	let openaiService: OpenaiService
	let openAI: jest.MockedObjectDeep<OpenAI>
	const logger = new Logger()

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				OpenaiService,
				{
					provide: Logger,
					useValue: {
						debug: jest.fn(),
						error: jest.fn(),
					},
				},
				{
					provide: OpenAIClientToken,
					useValue: {
						chat: {
							completions: {
								create: jest.fn(),
							},
						},
					},
				},
			],
		}).compile()

		openaiService = moduleRef.get<OpenaiService>(OpenaiService)
		openAI = moduleRef.get(OpenAIClientToken)
	})

	describe('Chat', () => {
		it('Get a chat response back (no options)', async () => {
			const domain = 'app::openai::test::chat'
			openAI.chat.completions.create.mockResolvedValueOnce({
				choices: [
					// @ts-ignore
					{
						message: {
							role: 'assistant',
							content: 'this is some content',
						},
						finish_reason: 'stop',
						index: 0,
					},
				],
				id: 'some id',
				created: Date.now(),
				model: 'model',
				object: 'chat.completion',
			})
			try {
				const result = <any>await openaiService.ask({
					messages: [{ role: 'user', content: 'Say this is a test' }],
				})
				expect(result).toBeDefined()
				expect(result).toHaveProperty('choices')
				expect(result.choices).toHaveLength(1)
				expect(result.choices[0]).toHaveProperty('message')
				expect(result.choices[0].message).toHaveProperty('content')
				expect(result.choices[0].message.content).toBeDefined()
			} catch (e) {
				logger.error(`[${domain}] Error: ${e.message}`, e)
				throw new Error(e.message)
			}
		})
	})
})
