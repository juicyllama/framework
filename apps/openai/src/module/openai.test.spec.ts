import { Test, TestingModule } from '@nestjs/testing'
import { Env } from '@juicyllama/utils'
import { forwardRef } from '@nestjs/common'
import { OpenaiModule } from './openai.module'
import { OpenaiService } from './openai.service'
import { Logger } from '@juicyllama/utils'

describe('OpenAI', () => {
	let moduleRef: TestingModule

	let openaiService: OpenaiService
	const logger = new Logger()

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [forwardRef(() => OpenaiModule)],
		}).compile()

		openaiService = moduleRef.get<OpenaiService>(OpenaiService)
	})

	describe('Chat', () => {
		it('Get a chat response back (no options)', async () => {
			const domain = 'app::openai::test::chat'

			try {
				const result = await openaiService.ask({
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
