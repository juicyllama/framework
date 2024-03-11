import { ConfigValidationModule, cacheConfig, databaseConfig } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AhrefsConfigDto } from '../config/ahrefs.config.dto'
import { AhrefsInstallationService } from './ahrefs.installation'
import { AhrefsModule } from './ahrefs.module'

describe('Ahrefs', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [
				ConfigModule.forRoot({
					isGlobal: true
				}),
				TypeOrmModule.forRoot(databaseConfig()),
				CacheModule.registerAsync(cacheConfig()),
				ConfigValidationModule.register(AhrefsConfigDto),
				AhrefsModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the AhrefsModule', () => {
		expect(moduleRef.get(AhrefsInstallationService, { strict: false })).toBeDefined()
	})
})
