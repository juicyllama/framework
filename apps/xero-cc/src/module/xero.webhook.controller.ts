import { Logger } from '@juicyllama/utils'
import { Controller, forwardRef, HttpStatus, Inject, Post, Req, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ApiExcludeController } from '@nestjs/swagger'
import crypto from 'crypto'

@Controller(`/app/xero_cc/webhook`)
@ApiExcludeController()
export class XeroWebhookController {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	@Post('/cc')
	async customConnection(@Req() req: any, @Res() response: any): Promise<void> {
		let webhook

		const XERO_WEBHOOK_SIGNING_KEY = this.configService.get<string>('xero_cc.XERO_WEBHOOK_SIGNING_KEY')
		if (!XERO_WEBHOOK_SIGNING_KEY) {
			this.logger.error(`:x: XERO_WEBHOOK_SIGNING_KEY not set`)
			response.status(HttpStatus.INTERNAL_SERVER_ERROR).send()
			return
		}

		try {
			const xero_req = req[XERO_WEBHOOK_SIGNING_KEY].toString('utf-8')
			if (xero_req && xero_req.headers) {
				webhook = xero_req
			}
		} catch (e) {
			this.logger.verbose(`App not matched`)
		}

		const hmac = crypto.createHmac('sha256', XERO_WEBHOOK_SIGNING_KEY).update(webhook).digest('base64')

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
