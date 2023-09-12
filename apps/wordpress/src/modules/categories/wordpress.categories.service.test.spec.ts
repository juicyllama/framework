import { Test, TestingModule } from '@nestjs/testing'
import { Env } from '@juicyllama/utils'
import { WordpressCategoriesService } from './wordpress.categories.service'
import { WordpressCategoriesModule } from './wordpress.categories.module'
import { forwardRef } from '@nestjs/common'
// @ts-ignore
import * as mock from './mock.json'
describe('WordPress Categories Service', () => {
	let moduleRef: TestingModule

	let wordpressCategoriesService: WordpressCategoriesService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [forwardRef(() => WordpressCategoriesModule)],
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
