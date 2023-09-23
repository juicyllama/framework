import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ChatPostMessageArguments } from '@slack/web-api/dist/methods'
import { App } from '@slack/bolt'
import { ChatPostMessageResponse } from '@slack/web-api'
import { Logger, Env } from '@juicyllama/utils'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class SlackChatService {
	constructor(
		@Inject(forwardRef(() => Logger)) private readonly logger: Logger,
		@Inject(forwardRef(() => ConfigService)) private readonly configService: ConfigService,
	) {}

	async send(message: ChatPostMessageArguments): Promise<ChatPostMessageResponse> {
		const domain = 'apps::slack::SlackChatService::send'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		const creds = {
			token: this.configService.get('slack.SLACK_BOT_TOKEN'),
			signingSecret: this.configService.get('slack.SLACK_SIGNING_SECRET'),
		}

		const app = new App(creds)

		try {
			this.logger.debug(`[${domain}] Request`, message)
			const response = await app.client.chat.postMessage(message)
			this.logger.debug(`[${domain}] Response`, response)
			return response
		} catch (e: any) {
			this.logger.error(`[${domain}] ${e.message}`, {
				message: message,
			})
		}
	}
}
