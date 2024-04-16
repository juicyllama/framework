import { cacheConfig, databaseConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AmazonSellerInstallationService } from './amazon.seller.installation'
import { AmazonSellerModule } from './amazon.seller.module'

describe('AmazonSeller', () => {
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
				AmazonSellerModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the AmazonSellerModule', () => {
		expect(moduleRef.get(AmazonSellerInstallationService, { strict: false })).toBeDefined()
	})
})
