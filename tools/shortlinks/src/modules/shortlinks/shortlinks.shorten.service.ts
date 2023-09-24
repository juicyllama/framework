import { BadRequestException, forwardRef, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common'
import { ShortenURLDto } from './shortlinks.dto.js'
import { nanoid } from 'nanoid'
import { isURL } from 'class-validator'
import { Account } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { Shortlink } from './shortlinks.entity.js'
import { ShortlinksService } from './shortlinks.service.js'

type T = Shortlink

@Injectable()
export class ShortlinksShortenService {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => ShortlinksService)) readonly shortlinksService: ShortlinksService,
	) {}

	async shortenUrl(data: ShortenURLDto, account: Account): Promise<T> {
		const domain = 'tools::shortlinks::shorten::service::shortenUrl'

		const { long_url } = data

		if (!isURL(long_url)) {
			throw new BadRequestException('String Must be a Valid URL')
		}

		const url_code = nanoid(10)
		const baseURL = this.configService.get<string>('tools_shortlinks.BASE_URL_SHORTLINKS')

		try {
			const url = await this.shortlinksService.findOne({
				where: {
					long_url: long_url,
					account: {
						account_id: account.account_id,
					},
				},
			})
			if (url) return url

			const short_url = `${baseURL}/${url_code}`

			return await this.shortlinksService.create({
				account: account,
				url_code: url_code,
				long_url: long_url,
				short_url: short_url,
				resource_type: data.resource_type,
				resource_id: data.resource_id,
			})
		} catch (e: any) {
			this.logger.error(`[${domain}] ${e.message}`, e)
			throw new UnprocessableEntityException('Server Error')
		}
	}
}
