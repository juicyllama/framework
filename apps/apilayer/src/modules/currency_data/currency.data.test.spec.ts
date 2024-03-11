import { Test, TestingModule } from '@nestjs/testing'
import { Dates, Env } from '@juicyllama/utils'
import { CurrencyDataModule } from './currency.data.module'
import { CurrencyDataService } from './currency.data.service'
import { ConfigModule } from '@nestjs/config'

describe('Number Verification Service', () => {
	let moduleRef: TestingModule

	let currencyDataService: CurrencyDataService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot(),
				CurrencyDataModule],
		}).compile()

		currencyDataService = moduleRef.get<CurrencyDataService>(CurrencyDataService)
	})

	describe('Retrieve', () => {
		it('Should get historic rate', async () => {
			const date = Dates.format(new Date(), 'YYYY-MM-DD')
			const rates = await currencyDataService.getRate(date)
			expect(rates.date).toBeDefined()
			expect(rates.quotes.USDAUD).toBeDefined()
		})
	})
})
