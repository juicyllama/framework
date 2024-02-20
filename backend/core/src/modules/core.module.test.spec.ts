import { Env } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
import { CoreModule } from './core.module'

describe('Core Bootup', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}
	})

	describe('Start App', () => {
		it('Does it boot up without issue?', async () => {
			try {
				moduleRef = await Test.createTestingModule({
					imports: [CoreModule],
					controllers: [],
					providers: [],
				}).compile()
			} catch (e) {
				// @ts-ignore
				expect(e.message).toEqual('Bootup failed')
			}
		})
	})
})
