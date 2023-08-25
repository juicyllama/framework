import { Test, TestingModule } from '@nestjs/testing'
import { forwardRef, HttpServer, INestApplication, ValidationPipe } from '@nestjs/common'
import { AccountService } from '../modules/accounts/account.service'
import { Account } from '../modules/accounts/account.entity'
import { User } from '../modules/users/users.entity'
import { Env, Logger, Security } from '@juicyllama/utils'
import { MockAccountRequest } from './mocks'
import { testCleanup } from './closedown'
import { validationPipeOptions } from '../configs'
import { AccountModule } from '../modules/accounts/account.module'
import { AuthModule } from '../modules/auth/auth.module'
import { AuthService } from '../modules/auth/auth.service'
import { Query } from '../utils/typeorm/Query'
import { DeepPartial, Repository } from 'typeorm'
import { faker } from '@faker-js/faker'

let httpServer: HttpServer
let moduleRef: TestingModule
let logger: Logger

export class ScaffoldDto<T> {
	server: HttpServer
	module: TestingModule
	query: Query<T>
	repository: Repository<T>
	services: {
		accountService: AccountService
		authService: AuthService
		logger: Logger
		service: any
	}
	values: {
		account: Account
		owner: User
		owner_access_token: string
		owner_password: string
		record: T
		mock: DeepPartial<T>
	}
}

export class Scaffold<T> {
	async up(MODULE?: any, SERVICE?: any): Promise<ScaffoldDto<T>> {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		let accountService: AccountService
		let authService: AuthService
		let service: any
		let query: Query<T>
		let repository: Repository<T>

		let account: Account
		let owner: User
		let owner_access_token: string
		const password = faker.internet.password(20, false, /[!-~]/)

		const imports = [forwardRef(() => AccountModule), forwardRef(() => AuthModule)]

		if (MODULE) {
			imports.push(forwardRef(() => MODULE))
		}

		try {
			moduleRef = await Test.createTestingModule({
				imports: imports,
				providers: [Query, Logger],
			}).compile()
		} catch (e) {
			console.error(e.message, e)
		}

		const app: INestApplication = moduleRef.createNestApplication()
		app.useGlobalPipes(new ValidationPipe(validationPipeOptions))
		await app.init()
		httpServer = app.getHttpServer()

		accountService = await moduleRef.resolve(AccountService)
		authService = await moduleRef.resolve(AuthService)
		logger = await moduleRef.resolve(Logger)
		query = await moduleRef.resolve(Query<T>)

		if (SERVICE) {
			service = await moduleRef.resolve(SERVICE)
			repository = service.repository
		}

		const result = await accountService.onboard(MockAccountRequest(password))
		account = result.account
		owner = result.owner

		const auth = await authService.login(owner)
		owner_access_token = auth.access_token

		return {
			server: httpServer,
			module: moduleRef,
			query: query,
			repository: repository,
			services: {
				accountService: accountService,
				authService: authService,
				logger: logger,
				service: service,
			},
			values: {
				account: account,
				owner: owner,
				owner_access_token: owner_access_token,
				owner_password: password,
				record: undefined,
				mock: undefined,
			},
		}
	}

	async down(E?: any) {
		try {
			await testCleanup(moduleRef, E)
		} catch (e) {
			logger.warn(e.message, e)
		}
	}
}
