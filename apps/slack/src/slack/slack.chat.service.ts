import { Logger, Env } from '@juicyllama/utils'
import { Injectable } from '@nestjs/common'
import { App } from '@slack/bolt'
import { ChatPostMessageResponse, ChatPostMessageArguments } from '@slack/web-api'
import { InjectSlack } from './slack.constants'

@Injectable()
export class SlackChatService {
	constructor(
		private readonly logger: Logger,
		@InjectSlack() private readonly app: App,
	) {}

	async send(message: ChatPostMessageArguments): Promise<ChatPostMessageResponse> {
		const domain = 'apps::slack::SlackChatService::send'

		if (Env.IsTest()) {
			this.logger.debug(`[${domain}] Skipping as in test mode`)
			return
		}

		try {
			this.logger.debug(`[${domain}] Request`, message)
			const response = await this.app.client.chat.postMessage(message)
			this.logger.debug(`[${domain}] Response`, response)
			return response
		} catch (e) {
			this.logger.error(`[${domain}] ${e.message}`, {
				message: message,
			})
		}
	}
}
