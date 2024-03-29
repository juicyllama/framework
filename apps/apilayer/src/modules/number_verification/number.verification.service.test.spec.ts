import { Test, TestingModule } from '@nestjs/testing'
import { Env } from '@juicyllama/utils'
import { NumberVerificationService } from './number.verification.service'
import { NumberVerificationModule } from './number.verification.module'
import { ConfigModule } from '@nestjs/config'

describe('Number Verification Service', () => {
	let moduleRef: TestingModule

	let numberVerificationService: NumberVerificationService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [ConfigModule.forRoot(), NumberVerificationModule],
		}).compile()

		numberVerificationService = moduleRef.get<NumberVerificationService>(NumberVerificationService)
	})

	describe('Verify Number', () => {
		it('Valid number passes verification', async () => {
			const response = await numberVerificationService.verify('447971854508')
			expect(response).toBeDefined()
			expect(response.valid).toBe(true)
		})

		/*it('Invalid number', async () => {
			const response = await numberVerificationService.verify('07971854508')
			expect(response).toBeDefined()
			expect(response.valid).toBe(false)
		})

		it('Number with ISO2 code', async () => {
			const response = await numberVerificationService.verify('07971854508', 'GB')
			expect(response).toBeDefined()
			expect(response.valid).toBe(true)
		})*/
	})
})
