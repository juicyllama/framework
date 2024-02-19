import { InjectConfig } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Controller, Post, Req, UnauthorizedException } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import crypto from 'crypto'
import { XeroConfigDto } from '../config/xero.config.dto'

@Controller('/app/xero_cc/webhook')
@ApiExcludeController()
export class XeroWebhookController {
	constructor(
		private readonly logger: Logger,
		@InjectConfig(XeroConfigDto) private readonly config: XeroConfigDto,
	) {}

	@Post('/cc')
	async customConnection(@Req() req: any): Promise<void> {
		let webhook

		try {
			const xero_req = req[this.config.XERO_CC_WEBHOOK_SIGNING_KEY].toString('utf-8')
			if (xero_req && xero_req.headers) {
				webhook = xero_req
			}
		} catch (e) {
			this.logger.verbose(`App not matched`)
		}

		const hmac = crypto
			.createHmac('sha256', this.config.XERO_CC_WEBHOOK_SIGNING_KEY)
			.update(webhook)
			.digest('base64')

		if (req.headers['x-xero-signature'] != hmac) {
			this.logger.warn(`:x: Failed x-xero-signature check`, {
				hmac: hmac,
				'x-xero-signature': req.headers['x-xero-signature'],
			})

			throw new UnauthorizedException()
		}

		//todo handle webhook
		this.logger.error(webhook)

		return
	}
}
