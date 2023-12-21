import { Api, Env, Images, Logger } from '@juicyllama/utils'
import { Test, TestingModule } from '@nestjs/testing'
// @ts-ignore
import * as mock from './mock.json'
import { WordpressMediaUrlToken } from './wordpress.media.constants'
import { WordpressMediaService } from './wordpress.media.service'

describe('WordPress Media Service', () => {
	let moduleRef: TestingModule

	let wordpressMediaService: WordpressMediaService

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			providers: [
				WordpressMediaService,
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
					provide: WordpressMediaUrlToken,
					useValue: '',
				},
			],
		}).compile()

		wordpressMediaService = moduleRef.get<WordpressMediaService>(WordpressMediaService)
	})

	describe('Create Media', () => {
		it('Able to create a media', async () => {
			const image = await Images.downloadImage(
				'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
			)

			const response = await wordpressMediaService.create({
				data: <any>mock,
				imageBuffer: image,
				filename: 'cropped-icon.png',
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
			expect(response.title.rendered).toEqual('cropped-icon.png')
		})
	})

	describe('Find All Media', () => {
		it('Able to find all media', async () => {
			const response = await wordpressMediaService.findAll()
			expect(response).toBeDefined()
			expect(response[0]).toBeDefined()
			expect(response[0].id).toBeDefined()
			expect(response[0].title.rendered).toEqual('cropped-icon.png')
		})
	})

	describe('Find One Media', () => {
		it('Able to find a media', async () => {
			const response = await wordpressMediaService.findOne({
				mediaId: mock.id,
			})
			expect(response).toBeDefined()
			expect(response.id).toBeDefined()
		})
	})
})
