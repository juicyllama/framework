import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	Req,
	UnprocessableEntityException,
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ShortenURLDto } from './shortlinks.dto'
import { nanoid } from 'nanoid'
import { isURL } from 'class-validator'
import { Query, BaseService, BeaconService, Account } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'
import { Shortlink } from './shortlinks.entity'
import { ShortlinkClick, ShortlinkClicksService } from './clicks'

type T = Shortlink
const E = Shortlink

@Injectable()
export class ShortlinksService extends BaseService<T> {
	constructor(
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
		@Inject(forwardRef(() => Query)) readonly query: Query<T>,
		@InjectRepository(E) readonly repository: Repository<T>,
		@Inject(forwardRef(() => BeaconService)) readonly beaconService: BeaconService,
		@Inject(forwardRef(() => Logger)) readonly logger: Logger,
		@Inject(forwardRef(() => ShortlinkClicksService)) readonly shortlinkClicksService: ShortlinkClicksService,
	) {
		super(query, repository, {
			beacon: beaconService,
		})
	}

	async shortenUrl(data: ShortenURLDto, account: Account): Promise<T> {
		const domain = 'tools::shortlinks::service::shortenUrl'

		const { long_url } = data

		if (!isURL(long_url)) {
			throw new BadRequestException('String Must be a Valid URL')
		}

		const url_code = nanoid(10)
		const baseURL = this.configService.get<string>('tools_shortlinks.BASE_URL_SHORTLINKS')

		try {
			const url = await this.query.findOneByWhere(this.repository, {
				long_url: long_url,
				account: {
					account_id: account.account_id,
				},
			})
			if (url) return url

			const short_url = `${baseURL}/${url_code}`

			return await this.query.create(this.repository, {
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

	/**
	 * To be called in your microservice to handle the redirect
	 */
	async redirect(@Req() req, url_code: string) {
		//const domain = 'tools::shortlinks::service::redirect'

		const shortlink = await this.query.findOneByWhere(this.repository, { url_code: url_code })

		if (!shortlink) throw new NotFoundException('Shortlink Not Found')

		const click = new ShortlinkClick({
			shortlink: shortlink,
			ip: req.ip,
		})

		if (!req.session?.useragent) {
			const userAgentIs = useragent => {
				const r = []
				for (const i in useragent) if (useragent[i] === true) r.push(i)
				return r
			}

			click.browser = req.useragent?.browser
			click.version = req.useragent?.version
			click.os = req.useragent?.os
			click.platform = req.useragent?.platform
			click.source = req.useragent?.source
			click.is = userAgentIs(req.useragent)
		}

		await this.shortlinkClicksService.query.create(this.shortlinkClicksService.repository, click)
		return shortlink
	}
}
