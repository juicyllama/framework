import { ConfigValidationModule } from '@juicyllama/core'
import { Env } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
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
				ConfigValidationModule.register(AhrefsConfigDto),
				AhrefsModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the AhrefsModule', () => {
		expect(moduleRef.get(AhrefsInstallationService, { strict: false })).toBeDefined()
	})
})
