import { Api, Env, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
// @ts-ignore
import * as mock from './mock.json'
import { WordpressPostsUrlToken } from './wordpress.posts.constants'
import { WordpressPostsService } from './wordpress.posts.service'

describe('WordPress Posts Service', () => {
	let moduleRef: TestingModule

	let wordpressPostsService: WordpressPostsService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				WordpressPostsService,
				{
					provide: Api,
					useValue: {
						post: jest.fn(),
					},
				},
				{
					provide: Logger,
					useValue: {
						error: jest.fn(),
						debug: jest.fn(),
					},
				},
				{
					provide: WordpressPostsUrlToken,
					useValue: '',
				},
			],
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
