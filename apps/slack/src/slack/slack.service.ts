import { Injectable } from '@nestjs/common'
import { ChatPostMessageResponse, ChatPostMessageArguments } from '@slack/web-api'
import { SlackChatService } from './slack.chat.service'

@Injectable()
export class SlackService {
	constructor(private readonly slackChatService: SlackChatService) {}

	/**
	 * Send basicMessage
	 * @param {ChatPostMessageArguments} message
	 */

	async sendMessage(message: ChatPostMessageArguments): Promise<ChatPostMessageResponse> {
		return await this.slackChatService.send(message)
	}
}
