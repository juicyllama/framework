import { Env } from '@juicyllama/utils'
import { CacheModule } from '@nestjs/cache-manager'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { TypeOrmModule } from '@nestjs/typeorm'
import { cacheConfig, databaseConfig } from '../configs'
import { CoreModule } from './core.module'

describe('Core Bootup', () => {
	let moduleRef: TestingModule

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}
	})

	describe('Start App', () => {
		it('Does it boot up without issue?', async () => {
			try {
				moduleRef = await Test.createTestingModule({
					imports: [
						ConfigModule.forRoot({
							isGlobal: true,
						}),
						TypeOrmModule.forRoot(databaseConfig()),
						CacheModule.registerAsync(cacheConfig()),
						CoreModule,
					],
					controllers: [],
					providers: [],
				}).compile()
			} catch (e) {
				// @ts-ignore
				expect(e.message).toEqual('Bootup failed')
			}
		})
	})
})
