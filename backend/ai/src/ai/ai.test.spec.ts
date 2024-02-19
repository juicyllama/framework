import { Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { AiModule } from './ai.module'
import { AiService } from './ai.service'

describe('AI', () => {
	let moduleRef: TestingModule

	let aiService: AiService
	const logger = new Logger()

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [AiModule],
		}).compile()

		aiService = moduleRef.get<AiService>(AiService)
	})

	describe('Chat', () => {
		it('Get a chat response back (no options)', async () => {
			const domain = 'app::openai::test::chat'

			try {
				const result = await aiService.chat({
					question: 'How much is that doggy in the window?',
				})
				expect(result).toBeDefined()
				expect(result.response).toBeDefined()
			} catch (err) {
				const e = err as Error
				logger.error(`[${domain}] Error: ${e.message}`, e)
				throw new Error(e.message)
			}
		})
	})
})
