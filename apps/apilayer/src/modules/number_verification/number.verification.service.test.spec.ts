import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Enviroment, Logger, Api } from '@juicyllama/utils'
import { MONGODB, mongodbConfig, Query } from '@juicyllama/core'
import { NumberVerificationService } from './number.verification.service'
import apilayerConfig from '../../config/apilayer.config'
import { NumberVerification } from './number.verification.entity.mongo'

describe('Number Verification Service', () => {
	let moduleRef: TestingModule

	let numberVerificationService: NumberVerificationService

	beforeAll(async () => {
		if (Enviroment[process.env.NODE_ENV] !== Enviroment.test) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
					load: [mongodbConfig, apilayerConfig],
				}),
				TypeOrmModule.forRootAsync(mongodbConfig()),
				TypeOrmModule.forFeature([NumberVerification], MONGODB),
			],
			providers: [NumberVerificationService, Logger, Query, Api],
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
