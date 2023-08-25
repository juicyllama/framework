import { Test, TestingModule } from '@nestjs/testing'
import { Env } from '@juicyllama/utils'
import { WordpressPostsService } from './wordpress.posts.service'
import { WordpressPostsModule } from './wordpress.posts.module'
import { forwardRef } from '@nestjs/common'
// @ts-ignore
import * as mock from './mock.json'
describe('WordPress Posts Service', () => {
	let moduleRef: TestingModule

	let wordpressPostsService: WordpressPostsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [forwardRef(() => WordpressPostsModule)],
		}).compile()

		wordpressPostsService = moduleRef.get<WordpressPostsService>(WordpressPostsService)
	})

	describe('Create Post', () => {
		it('Able to create a post', async () => {
			const response = await wordpressPostsService.create({
				data: <any>mock,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
			expect(response.title.rendered).toEqual('Example post')
		})
	})

	describe('Find All Posts', () => {
		it('Able to find all posts', async () => {
			const response = await wordpressPostsService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
			expect(response[0].title.rendered).toEqual('Example post')
		})
	})

	describe('Find One Post', () => {
		it('Able to find a post', async () => {
			const response = await wordpressPostsService.findOne({
				postId: mock.id,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
			expect(response.title.rendered).toEqual('Example post')
		})
	})
})
