import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
// @ts-ignore
import * as mock from './mock.json'
import { WordpressUsersUrlToken } from './wordpress.users.constants'
import { WordpressUsersService } from './wordpress.users.service'

describe('WordPress Users Service', () => {
	let moduleRef: TestingModule

	let wordpressUsersService: WordpressUsersService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				WordpressUsersService,
				{
					provide: Api,
					useValue: {
						post: jest.fn(),
					},
				},
				{
					provide: Logger,
					useValue: {
						debug: jest.fn(),
						error: jest.fn(),
					},
				},
				{
					provide: WordpressUsersUrlToken,
					useValue: '',
				},
			],
		}).compile()

		wordpressUsersService = moduleRef.get<WordpressUsersService>(WordpressUsersService)
	})

	describe('Create User', () => {
		it('Able to create a User', async () => {
			const response = await wordpressUsersService.create({
				data: <any>mock,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
			expect(response.username).toEqual('andy')
		})
	})

	describe('Find All Users', () => {
		it('Able to find all Users', async () => {
			const response = await wordpressUsersService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
			expect(response[0].username).toEqual('andy')
		})
	})

	describe('Find One User', () => {
		it('Able to find a User', async () => {
			const response = await wordpressUsersService.findOne({
				postId: mock.id,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
			expect(response.username).toEqual('andy')
		})
	})
})
