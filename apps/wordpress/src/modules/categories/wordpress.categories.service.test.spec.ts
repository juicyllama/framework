import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
// @ts-ignore
import * as mock from './mock.json'
import { WordpressCategoriesUrlToken } from './wordpress.categories.constants'
import { WordpressCategoriesService } from './wordpress.categories.service'

describe('WordPress Categories Service', () => {
	let moduleRef: TestingModule

	let wordpressCategoriesService: WordpressCategoriesService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				WordpressCategoriesService,
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
					provide: WordpressCategoriesUrlToken,
					useValue: '',
				},
			],
		}).compile()

		wordpressCategoriesService = moduleRef.get<WordpressCategoriesService>(WordpressCategoriesService)
	})

	describe('Create Category', () => {
		it('Able to create a Category', async () => {
			const response = await wordpressCategoriesService.create({
				data: <any>mock,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
		})
	})

	describe('Find All Categories', () => {
		it('Able to find all Categories', async () => {
			const response = await wordpressCategoriesService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
		})
	})

	describe('Find One Category', () => {
		it('Able to find a Category', async () => {
			const response = await wordpressCategoriesService.findOne({
				postId: mock.id,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
		})
	})
})
