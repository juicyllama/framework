import { Body, Controller, Post } from '@nestjs/common'
import { SlackService } from '../slack/slack.service'
import { ChatPostMessageArguments } from '@slack/web-api/dist/methods'

@Controller('/')
export class SandboxController {
	constructor(private readonly slackService: SlackService) {}

	@Post()
	async message(@Body() data: ChatPostMessageArguments) {
		try {
			return await this.slackService.sendMessage(data)
		} catch (e) {
			console.log(e)
		}
	}
}
