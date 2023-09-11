import { Test, TestingModule } from '@nestjs/testing'
import { Api, Env } from '@juicyllama/utils'
import { forwardRef } from '@nestjs/common'
import { getWordpressAxiosConfig } from '../config/wordpress.config'
import { WordpressContext } from './wordpress.enums'
import { WordpressUsersService } from './users/wordpress.users.service'
import { WordpressUsersModule } from './users/wordpress.users.module'
import { wordpressConfigDto } from '../config/wordpress.config.dto'
describe('WordPress', () => {
	let moduleRef: TestingModule

	let wordpressUsersService: WordpressUsersService
	let api = new Api()

	beforeAll(async () => {
		if (Env.IsNotTest()) {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}

		moduleRef = await Test.createTestingModule({
			imports: [forwardRef(() => WordpressUsersModule)],
		}).compile()

		wordpressUsersService = moduleRef.get<WordpressUsersService>(WordpressUsersService)
	})

	describe('Auth Failure', () => {
		it('Ensure API fails if auth fails', async () => {
			const domain = 'app::wordpress::test::auth'

			const options = {
				config: <wordpressConfigDto>{
					WORDPRESS_URL: 'https://juicyllama.com/wp-json/wp/v2/users',
					WORDPRESS_USERNAME: 'test',
					WORDPRESS_APPLICATION_PASSWORD: 'test',
				},
				arguments: {
					context: WordpressContext.edit,
				},
			}

			const url = new URL(options.config.WORDPRESS_URL)
			url.search = new URLSearchParams(<any>options.arguments).toString()

			try {
				await api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
			} catch (e) {
				console.log('e.response', e.response)
				expect(e.response.status).not.toEqual(200)
			}
		})

		it('Ensure API fails if site not found / timeout', async () => {
			const domain = 'app::wordpress::test::auth'

			const options = {
				config: <wordpressConfigDto>{
					WORDPRESS_URL: 'https://none/wp-json/wp/v2/users',
					WORDPRESS_USERNAME: 'test',
					WORDPRESS_APPLICATION_PASSWORD: 'test',
				},
				arguments: {
					context: WordpressContext.edit,
				},
			}

			const url = new URL(options.config.WORDPRESS_URL)
			url.search = new URLSearchParams(<any>options.arguments).toString()

			try {
				await api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
			} catch (e) {
				expect(e.response.status).not.toEqual(200)
			}
		})
	})
})
