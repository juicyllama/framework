import { Test, TestingModule } from '@nestjs/testing'
import { InstalledAppAuthService } from './installed-app-auth.service'

describe('InstalledAppAuthService', () => {
	let service: InstalledAppAuthService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [InstalledAppAuthService],
		}).compile()

		service = module.get<InstalledAppAuthService>(InstalledAppAuthService)
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})
})
