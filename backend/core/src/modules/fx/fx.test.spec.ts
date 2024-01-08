import { SupportedCurrencies } from '@juicyllama/utils'
import { FxModule } from './fx.module.js'
import { FxService } from './fx.service.js'
import { FxRate } from './fx.entity.js'
import { Scaffold, ScaffoldDto } from '../../test'
import { fxMock } from './mock.js'

describe('FxService', () => {
	const scaffolding = new Scaffold<FxRate>()
	let scaffold: ScaffoldDto<FxRate>

	beforeAll(async () => {
		scaffold = await scaffolding.up(FxModule, FxService)
	})

	describe('Convert', () => {
		it('Create some FX rates', async () => {
			await scaffold.services.service.create({
				date: new Date(),
				...fxMock,
			})
		})

		it('Should return a correct conversion', async () => {
			const GBPtoUSD = await scaffold.services.service.convert(
				100,
				SupportedCurrencies.GBP,
				SupportedCurrencies.USD,
			)
			expect(GBPtoUSD).toEqual(121.24121910470633)
			const USDtoGBP = await scaffold.services.service.convert(
				100,
				SupportedCurrencies.USD,
				SupportedCurrencies.GBP,
			)
			expect(USDtoGBP).toEqual(82.4802)
			const USDtoUSD = await scaffold.services.service.convert(
				100,
				SupportedCurrencies.USD,
				SupportedCurrencies.USD,
			)
			expect(USDtoUSD).toEqual(100)
		})
	})

	afterAll(async () => {
		await scaffolding.down(FxRate)
	})
})
