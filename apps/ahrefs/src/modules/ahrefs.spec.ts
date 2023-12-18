import { ConfigValidationModule } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { AhrefsConfigDto } from '../config/ahrefs.config.dto'
import { AhrefsModule } from './ahrefs.module'
import { AhrefsInstallationService } from './ahrefs.installation'
describe('Ahrefs', () => {
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
				ConfigValidationModule.register(AhrefsConfigDto),
				AhrefsModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the AhrefsModule', () => {
		expect(moduleRef.get(AhrefsInstallationService, { strict: false })).toBeDefined()
	})
})
