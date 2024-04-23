import { Account, BaseService, BeaconService, InjectConfig, Query } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import {
	BadRequestException,
	forwardRef,
	Inject,
	Injectable,
	NotFoundException,
	Req,
	UnprocessableEntityException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isURL } from 'class-validator'
import uuid from 'uuid'
import { Repository } from 'typeorm'
import { ShortlinksConfigDto } from '../../config/shortlinks.config.dto'
import { ShortlinkClick, ShortlinkClicksService } from './clicks'
import { ShortenURLDto } from './shortlinks.dto'
import { Shortlink } from './shortlinks.entity'

type T = Shortlink
const E = Shortlink

@Injectable()
export class ShortlinksService extends BaseService<T> {
	constructor(
		@InjectConfig(ShortlinksConfigDto) private readonly configService: ShortlinksConfigDto,
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

		const url_code = customNanoID()
		const baseURL = this.configService.BASE_URL_SHORTLINKS

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
		} catch (err) {
			const e = err as Error
			this.logger.error(`[${domain}] ${e.message}`, e)
			throw new UnprocessableEntityException('Server Error')
		}
	}

	/**
	 * To be called in your microservice to handle the redirect
	 */
	async redirect(@Req() req: any, url_code: string) {
		//const domain = 'tools::shortlinks::service::redirect'

		const shortlink = await this.query.findOneByWhere(this.repository, { url_code: url_code })

		if (!shortlink) throw new NotFoundException('Shortlink Not Found')

		const click = new ShortlinkClick({
			shortlink: shortlink,
			ip: req.ip,
		})

		if (!req.session?.useragent) {
			const userAgentIs = (useragent: any) => {
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

function customNanoID(): string {
	const hexUUID = uuid.v4().substring(0, 10).replace(/-/g, '') // Remove dashes
	const buffer = Buffer.from(hexUUID, 'hex')
	return buffer
		.toString('base64') // Convert hex to base64
		.replace(/\+/g, '-') // Replace + with - to make it URL safe
		.replace(/\//g, '_') // Replace / with _ to make it URL safe
		.replace(/=/g, '') // Remove padding
}
