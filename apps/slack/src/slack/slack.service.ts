import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { ChatPostMessageArguments } from '@slack/web-api/dist/methods'
import { ChatPostMessageResponse } from '@slack/web-api'
import { SlackChatService } from './slack.chat.service'

@Injectable()
export class SlackService {
	constructor(@Inject(forwardRef(() => SlackChatService)) private readonly slackChatService: SlackChatService) {}

	/**
	 * Send basicMessage
	 * @param {ChatPostMessageArguments} message
	 */

	async sendMessage(message: ChatPostMessageArguments): Promise<ChatPostMessageResponse> {
		return await this.slackChatService.send(message)
	}
}
