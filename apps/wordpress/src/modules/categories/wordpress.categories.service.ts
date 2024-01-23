import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger, Env } from '@juicyllama/utils'
import * as mock from './mock.json'
import { wordpressConfigDto } from '../../config/wordpress.config.dto'
import {
	WordpressCategory,
	WordpressCreateCategory,
	WordpressListCategories,
	WordpressGetCategory,
	WordpressUpdateCategory,
} from './wordpress.categories.dto'
import { getWordpressAxiosConfig, getWordpressUrl } from '../../config/wordpress.config'

const ENDPOINT = `/wp-json/wp/v2/categories`

@Injectable()
export class WordpressCategoriesService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
	) {}

	async create(options: { data: WordpressCreateCategory; config?: wordpressConfigDto }): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}
		if (!options.config) throw new Error('Missing config')

		try {
			const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error creating category: ${e.message}`, e)
			throw e
		}
	}

	async findAll(options?: {
		arguments?: WordpressListCategories
		config?: wordpressConfigDto
	}): Promise<WordpressCategory[]> {
		const domain = 'app::wordpress::categories::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}
		if (!options?.config) throw new Error('Missing config')

		try {
			const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString())
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding all categories: ${e.message}`, e)
			throw e
		}
	}

	async findOne(options: {
		postId: number
		arguments?: WordpressGetCategory
		config?: wordpressConfigDto
	}): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::findOne'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}
		if (!options.config) throw new Error('Missing config')

		try {
			const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error finding one category: ${e.message}`, e)
			throw e
		}
	}

	async update(options: {
		postId: number
		data: WordpressUpdateCategory
		config?: wordpressConfigDto
	}): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}
		if (!options.config) throw new Error('Missing config')

		try {
			const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error updating category: ${e.message}`, e)
			throw e
		}
	}

	async remove(options: { postId: number; config?: wordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::categories::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		if (!options.config) throw new Error('Missing config')

		try {
			const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
			await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] Error removing category: ${e.message}`, e)
			throw e
		}
	}
}
