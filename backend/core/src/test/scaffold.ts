import { faker } from '@faker-js/faker'
import { Api, Env, Logger } from '@juicyllama/utils'
import { forwardRef, HttpServer, INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { DeepPartial, Repository, ObjectLiteral } from 'typeorm'
import { validationPipeOptions } from '../configs/nest.config'
import { Account } from '../modules/accounts/account.entity'
import { AccountModule } from '../modules/accounts/account.module'
import { AccountService } from '../modules/accounts/account.service'
import { User } from '../modules/users/users.entity'
import { AuthModule } from '../modules/auth/auth.module'
import { AuthService } from '../modules/auth/auth.service'
import { Query } from '../utils/typeorm/Query'
import { testCleanup } from './closedown'
import { MockAccountRequest } from './mocks'

let httpServer: HttpServer
let moduleRef: TestingModule
let logger: Logger
let api: Api

export class ScaffoldDto<T extends ObjectLiteral> {
	server!: HttpServer
	module!: TestingModule
	query!: Query<T>
	repository?: Repository<T>
	services!: {
		accountService: AccountService
		authService: AuthService
		logger: Logger
		api: Api
		service: any
	}
	values!: {
		account: Account
		owner: User
		owner_access_token: string
		owner_password: string
		record: T | undefined
		mock: DeepPartial<T> | undefined
	}
}

export class ScaffoldDtoWithRepository<T extends ObjectLiteral> extends ScaffoldDto<T> {
	repository!: Repository<T>
}

export class Scaffold<T extends ObjectLiteral> {
	async up(MODULE?: any, SERVICE?: any): Promise<ScaffoldDto<T>> {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		let accountService: AccountService
		let authService: AuthService
		let service: any
		let query: Query<T>
		let repository: Repository<T> | undefined = undefined

		let account: Account
		let owner: User
		let owner_access_token: string
		const password = faker.internet.password({
			length: 20,
			memorable: false,
			pattern: /[!-~]/,
		})

		const imports = [forwardRef(() => AccountModule), forwardRef(() => AuthModule)]

		if (MODULE) {
			imports.push(forwardRef(() => MODULE))
		}

		try {
			moduleRef = await Test.createTestingModule({
				imports: imports,
				providers: [Query, Logger, Api],
			}).compile()
		} catch (e) {
			const error = e as Error
			console.error(error.message, error)
		}

		const app: INestApplication = moduleRef.createNestApplication()
		app.useGlobalPipes(new ValidationPipe(validationPipeOptions))
		await app.init()
		httpServer = app.getHttpServer()

		accountService = await moduleRef.resolve(AccountService)
		authService = await moduleRef.resolve(AuthService)
		logger = await moduleRef.resolve(Logger)
		api = await moduleRef.resolve(Api)
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
				api: api,
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
			const error = e as Error
			console.warn(error.message, error)
		}
	}
}
