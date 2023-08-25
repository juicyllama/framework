import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
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
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async create(options: { data: WordpressCreateCategory; config?: wordpressConfigDto }): Promise<WordpressCategory> {
		const domain = 'app::wordpress::categories::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
		return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
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

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
		url.search = new URLSearchParams(<any>options.arguments).toString()
		return await this.api.get(domain, url.toString())
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

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
		url.search = new URLSearchParams(<any>options.arguments).toString()
		return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
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

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
		return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
	}

	async remove(options: { postId: number; config?: wordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::categories::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
		await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		return
	}
}
