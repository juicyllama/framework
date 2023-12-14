import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { Env } from '@juicyllama/utils'
import { AhrefsModule } from './ahrefs.module'
import { AhrefsInstallationService } from './ahrefs.installation'
import ahrefsConfig from '../config/ahrefs.config'
import { ahrefsConfigJoi } from '../config/ahrefs.config.joi'
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
					load: [ahrefsConfig],
					validationSchema: Env.IsNotTest() ? ahrefsConfigJoi : null,
				}),
				AhrefsModule,
			],
		}).compile()
	}, 180000)
	it('should allow for the use of the AhrefsModule', () => {
		expect(moduleRef.get(AhrefsInstallationService, { strict: false })).toBeDefined()
	})
})
