import { Enviroment, Dates } from '@juicyllama/utils'
import { ApilayerCurrencyData } from './apilayer.currency.data'
import dotenv from 'dotenv'

dotenv.config()
const apilayerCurrencyData = new ApilayerCurrencyData()

describe('ApilayerCurrencyDataService', () => {
	beforeAll(async () => {
		if (Enviroment[process.env.NODE_ENV] !== Enviroment.test) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}
	})

	describe('Retrieve', () => {
		it('Should get historic rate', async () => {
			const date = Dates.format(new Date(), 'YYYY-MM-DD')
			const rates = await apilayerCurrencyData.getRate(date)
			expect(rates.date).toBeDefined()
			expect(rates.quotes.USDAUD).toBeDefined()
		})
	})
})
