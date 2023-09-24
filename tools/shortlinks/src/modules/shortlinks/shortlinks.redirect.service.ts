import { forwardRef, Inject, Injectable, NotFoundException, Req } from '@nestjs/common'
import { ShortlinkClick, ShortlinkClicksService } from './clicks/index.js'
import { ShortlinksService } from './shortlinks.service.js'

@Injectable()
export class ShortlinksRedirectService {
	constructor(
		@Inject(forwardRef(() => ShortlinksService)) readonly shortlinksService: ShortlinksService,
		@Inject(forwardRef(() => ShortlinkClicksService)) readonly shortlinkClicksService: ShortlinkClicksService,
	) {}

	/**
	 * To be called in your microservice to handle the redirect
	 */
	async redirect(@Req() req, url_code: string) {
		//const domain = 'tools::shortlinks::redirect::service::redirect'

		const shortlink = await this.shortlinksService.findOne({
			where: {
				url_code: url_code,
			},
		})

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

		await this.shortlinkClicksService.create(click)
		return shortlink
	}
}
