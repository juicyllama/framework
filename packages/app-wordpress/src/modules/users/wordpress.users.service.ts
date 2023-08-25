import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Api, Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import * as mock from './mock.json'
import { wordpressConfigDto } from '../../config/wordpress.config.dto'
import {
	WordpressGetUser,
	WordpressListUsers,
	WordpressUser,
	WordpressCreateUser,
	WordpressUpdateUser,
} from './wordpress.users.dto'
import { getWordpressAxiosConfig, getWordpressUrl } from '../../config/wordpress.config'

const ENDPOINT = `/wp-json/wp/v2/users`

@Injectable()
export class WordpressUsersService {
	constructor(
		@Inject(forwardRef(() => Api)) private readonly api: Api,
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async create(options: { data: WordpressCreateUser; config?: wordpressConfigDto }): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
		return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
	}

	async findAll(options?: { arguments?: WordpressListUsers; config?: wordpressConfigDto }): Promise<WordpressUser[]> {
		const domain = 'app::wordpress::users::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT)
		url.search = new URLSearchParams(<any>options.arguments).toString()
		return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
	}

	async findOne(options: {
		postId: number
		arguments?: WordpressGetUser
		config?: wordpressConfigDto
	}): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::findOne'

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
		data: WordpressUpdateUser
		config?: wordpressConfigDto
	}): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
		return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
	}

	async remove(options: { postId: number; config?: wordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::users::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		const url = new URL(getWordpressUrl(options.config) + ENDPOINT + '/' + options.postId)
		await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		return
	}
}
