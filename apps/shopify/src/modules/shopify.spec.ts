import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { Env } from '@juicyllama/utils'
import { ShopifyModule } from './shopify.module'
import { ShopifyInstallationService } from './shopify.installation'

describe('Shopify', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true,
				}),
				ShopifyModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the ShopifyModule', () => {
		expect(moduleRef.get(ShopifyInstallationService, { strict: false })).toBeDefined()
	})
})
