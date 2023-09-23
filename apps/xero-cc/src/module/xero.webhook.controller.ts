import { Controller, forwardRef, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common'
import { ApiExcludeController } from '@nestjs/swagger'
import crypto from 'crypto'
import { Logger } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'

@Controller(`/app/xero_cc/webhook`)
@ApiExcludeController()
export class XeroWebhookController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	@Post('/cc')
	async customConnection(@Req() req, @Res() response): Promise<void> {
		let webhook

		try {
			const xero_req = req[this.configService.get<string>('xero_cc.XERO_WEBHOOK_SIGNING_KEY')].toString('utf-8')
			if (xero_req && xero_req.headers) {
				webhook = xero_req
			}
		} catch (e: any) {
			this.logger.verbose(`App not matched`)
		}

		const hmac = crypto
			.createHmac('sha256', this.configService.get<string>('xero_cc.XERO_WEBHOOK_SIGNING_KEY'))
			.update(webhook)
			.digest('base64')

		if (req.headers['x-xero-signature'] != hmac) {
			this.logger.warn(`:x: Failed x-xero-signature check`, {
				hmac: hmac,
				'x-xero-signature': req.headers['x-xero-signature'],
			})

			response.status(HttpStatus.UNAUTHORIZED).send()

			return
		}

		//todo handle webhook
		this.logger.error(webhook)

		response.status(HttpStatus.OK).send()

		return
	}
}
