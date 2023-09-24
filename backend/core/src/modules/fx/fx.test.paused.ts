import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { CacheModule} from '@nestjs/cache-manager'
import { forwardRef } from '@nestjs/common'
import { Logger } from '@juicyllama/utils'
import { ConfigModule } from '@nestjs/config'
import { Enviroment, SupportedCurrencies } from '@juicyllama/utils'
import { FxService } from './fx.service.js'
import { FxRate } from './fx.entity.js'
import { databaseConfig } from '../../configs/database.config.js'
import cacheConfig from '../../configs/cache.config.js'
import { testCleanup } from '../../test/closedown.js'
import { Query } from '../../utils/typeorm/Query.js'
import { CacheService } from '../../utils/typeorm/Cache.js'

describe('TagsService', () => {
	let fxService: FxService
	let moduleRef: TestingModule
	let cacheService: CacheService

	let fxRates: FxRate[]

	beforeAll(async () => {
		if (Enviroment[process.env.NODE_ENV] !== Enviroment.test) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					load: [databaseConfig, cacheConfig],
					isGlobal: true,
				}),
				CacheModule.registerAsync(cacheConfig()),
				TypeOrmModule.forRoot(databaseConfig()),
				TypeOrmModule.forFeature([FxRate]),
			],
			providers: [FxService, Logger, Query, CacheService],
		}).compile()

		fxService = moduleRef.get<FxService>(FxService)
	})

	describe('Convert', () => {
		it('Should return a correct conversion', async () => {
			const GBPtoUSD = await fxService.convert(100, SupportedCurrencies.GBP, SupportedCurrencies.USD)
			expect(GBPtoUSD).toEqual(110.78675212018148)
			const USDtoGBP = await fxService.convert(100, SupportedCurrencies.USD, SupportedCurrencies.GBP)
			expect(USDtoGBP).toEqual(90.2635)
			const USDtoUSD = await fxService.convert(100, SupportedCurrencies.USD, SupportedCurrencies.USD)
			expect(USDtoUSD).toEqual(100)
		})
	})

	afterAll(async () => {
		await testCleanup(moduleRef, FxRate)
	})
})
