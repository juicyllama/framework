import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { getWordpressAxiosConfig } from '../../config/wordpress.config'
import * as mock from './mock.json'
import {
	WordpressCreatePost,
	WordpressGetPost,
	WordpressListPosts,
	WordpressPost,
	WordpressUpdatePost,
} from './wordpress.posts.dto'
import { InjectWordpressPostsUrl } from './wordpress.posts.constants'

@Injectable()
export class WordpressPostsService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectWordpressPostsUrl() private readonly urlBase: string,
	) {}

	async create(options: { data: WordpressCreatePost; config?: WordpressConfigDto }): Promise<WordpressPost> {
		const domain = 'app::wordpress::posts::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(this.urlBase)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error creating post: ${e.message}`, e)
		}
	}

	async findAll(options?: { arguments?: WordpressListPosts; config?: WordpressConfigDto }): Promise<WordpressPost[]> {
		const domain = 'app::wordpress::posts::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}

		try {
			const url = new URL(this.urlBase)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString())
		} catch (e) {
			this.logger.error(`[${domain}] Error finding all posts: ${e.message}`, e)
		}
	}

	async findOne(options: {
		postId: number
		arguments?: WordpressGetPost
		config?: WordpressConfigDto
	}): Promise<WordpressPost> {
		const domain = 'app::wordpress::posts::findOne'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding one post: ${e.message}`, e)
		}
	}

	async update(options: {
		postId: number
		data: WordpressUpdatePost
		config?: WordpressConfigDto
	}): Promise<WordpressPost> {
		const domain = 'app::wordpress::posts::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error updating post: ${e.message}`, e)
		}
	}

	async remove(options: { postId: number; config?: WordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::posts::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error removing post: ${e.message}`, e)
		}
	}
}
