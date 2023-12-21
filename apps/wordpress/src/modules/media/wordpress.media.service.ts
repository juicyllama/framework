import { Api, Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { WordpressConfigDto } from '../../config/wordpress.config.dto'
import { getWordpressAxiosConfig } from '../../config/wordpress.config'
import * as mock from './mock.json'
import { InjectWordpressMediaUrl } from './wordpress.media.constants'
import {
	WordpressCreateMedia,
	WordpressGetMedia,
	WordpressListMedia,
	WordpressMedia,
	WordpressUpdateMedia,
} from './wordpress.media.dto'

@Injectable()
export class WordpressMediaService {
	constructor(
		private readonly api: Api,
		private readonly logger: Logger,
		@InjectWordpressMediaUrl() private readonly urlBase: string,
	) {}

	async create(options: {
		data: WordpressCreateMedia
		imageBuffer: Buffer
		filename: string
		config?: WordpressConfigDto
	}): Promise<WordpressMedia> {
		const domain = 'app::wordpress::media::create'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(this.urlBase)

			const media = await this.api.post(domain, url.toString(), options.imageBuffer, {
				headers: {
					...getWordpressAxiosConfig(options.config).headers,
					'Content-Disposition': `attachment; filename="${options.filename}"`,
					'Content-Type': 'image/jpeg',
				},
			})

			return await this.update({ mediaId: media.id, data: options.data, config: options.config })
		} catch (e) {
			this.logger.error(`[${domain}] Error creating media: ${e.message}`, e)
		}
	}

	async findAll(options?: {
		arguments?: WordpressListMedia
		config?: WordpressConfigDto
	}): Promise<WordpressMedia[]> {
		const domain = 'app::wordpress::media::findAll'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return [<any>mock]
		}

		try {
			const url = new URL(this.urlBase)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString())
		} catch (e) {
			this.logger.error(`[${domain}] Error finding all media: ${e.message}`, e)
		}
	}

	async findOne(options: {
		mediaId: number
		arguments?: WordpressGetMedia
		config?: WordpressConfigDto
	}): Promise<WordpressMedia> {
		const domain = 'app::wordpress::media::findOne'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.mediaId}`)
			url.search = new URLSearchParams(<any>options.arguments).toString()
			return await this.api.get(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error finding one media: ${e.message}`, e)
		}
	}

	async update(options: {
		mediaId: number
		data: WordpressUpdateMedia
		config?: WordpressConfigDto
	}): Promise<WordpressMedia> {
		const domain = 'app::wordpress::media::update'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return <any>mock
		}

		try {
			const url = new URL(`${this.urlBase}/${options.mediaId}`)
			return await this.api.post(domain, url.toString(), options.data, getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error updating media: ${e.message}`, e)
		}
	}

	async remove(options: { mediaId: number; config?: WordpressConfigDto }): Promise<void> {
		const domain = 'app::wordpress::media::remove'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			const url = new URL(`${this.urlBase}/${options.mediaId}`)
			await this.api.delete(domain, url.toString(), getWordpressAxiosConfig(options.config))
		} catch (e) {
			this.logger.error(`[${domain}] Error deleting media: ${e.message}`, e)
		}
	}
}
