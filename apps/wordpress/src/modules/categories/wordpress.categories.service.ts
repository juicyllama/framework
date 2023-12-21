import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { getWordpressAxiosConfig } from '../../config/wordpress.config'
import * as mock from './mock.json'
import { InjectWordpressCategoriesUrl } from './wordpress.categories.constants'
import {
	WordpressCategory,
	WordpressCreateCategory,
	WordpressListCategories,
	WordpressGetCategory,
	WordpressUpdateCategory,
} from './wordpress.categories.dto'

@Injectable()
export class WordpressCategoriesService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectWordpressCategoriesUrl() private readonly urlBase: string,
	) {}

	async create(options: { data: WordpressCreateCategory; config?: WordpressConfigDto }): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(this.urlBase)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error creating category: ${e.message}`, e)
		}
	}

	async findAll(options?: {
		arguments?: WordpressListCategories
		config?: WordpressConfigDto
	}): Promise<WordpressCategory[]> {
		const domain = 'app::wordpress::categories::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}

		try {
			const url = new URL(this.urlBase)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString())
		} catch (e) {
			this.logger.error(`[${domain}] Error finding all categories: ${e.message}`, e)
		}
	}

	async findOne(options: {
		postId: number
		arguments?: WordpressGetCategory
		config?: WordpressConfigDto
	}): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::findOne'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding one category: ${e.message}`, e)
		}
	}

	async update(options: {
		postId: number
		data: WordpressUpdateCategory
		config?: WordpressConfigDto
	}): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error updating category: ${e.message}`, e)
		}
	}

	async remove(options: { postId: number; config?: WordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::categories::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error removing category: ${e.message}`, e)
		}
	}
}
