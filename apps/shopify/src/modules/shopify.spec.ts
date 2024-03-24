import { Env } from '@juicyllama/utils'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ShopifyInstallationService } from './shopify.installation'
import { ShopifyModule } from './shopify.module'
import { cacheConfig, databaseConfig } from '@juicyllama/core'
import { CacheModule } from '@nestjs/cache-manager'

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
				TypeOrmModule.forRoot(databaseConfig()),
				CacheModule.registerAsync(cacheConfig()),
				ShopifyModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the ShopifyModule', () => {
		expect(moduleRef.get(ShopifyInstallationService, { strict: false })).toBeDefined()
	})
})
