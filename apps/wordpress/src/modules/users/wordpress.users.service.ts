import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { getWordpressAxiosConfig } from '../../config/wordpress.config'
import * as mock from './mock.json'
import {
	WordpressGetUser,
	WordpressListUsers,
	WordpressUser,
	WordpressCreateUser,
	WordpressUpdateUser,
} from './wordpress.users.dto'
import { InjectWordpressUsersUrl } from './wordpress.users.constants'

@Injectable()
export class WordpressUsersService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectWordpressUsersUrl() private readonly urlBase: string,
	) {}

	async create(options: { data: WordpressCreateUser; config?: WordpressConfigDto }): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(this.urlBase)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error creating user: ${e.message}`, e)
		}
	}

	async findAll(options?: { arguments?: WordpressListUsers; config?: WordpressConfigDto }): Promise<WordpressUser[]> {
		const domain = 'app::wordpress::users::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}

		try {
			const url = new URL(this.urlBase)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding all users: ${e.message}`, e)
		}
	}

	async findOne(options: {
		postId: number
		arguments?: WordpressGetUser
		config?: WordpressConfigDto
	}): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::findOne'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding one user: ${e.message}`, e)
		}
	}

	async update(options: {
		postId: number
		data: WordpressUpdateUser
		config?: WordpressConfigDto
	}): Promise<WordpressUser> {
		const domain = 'app::wordpress::users::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error updating user: ${e.message}`, e)
		}
	}

	async remove(options: { postId: number; config?: WordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::users::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			const url = new URL(`${this.urlBase}/${options.postId}`)
			await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error removing user: ${e.message}`, e)
		}
	}
}
