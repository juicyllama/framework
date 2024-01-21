import { Body, Controller, forwardRef, Inject, Req, Post } from '@nestjs/common'
import { SlackService } from '../slack/slack.service'
import { ChatPostMessageArguments } from '@slack/web-api/dist/methods'

@Controller('/')
export class SandboxController {
	constructor(@Inject(forwardRef(() => SlackService)) private readonly slackService: SlackService) {}

	@Post()
	async message(@Req() req: any, @Body() data: ChatPostMessageArguments) {
		try {
			return await this.slackService.sendMessage(data)
		} catch (e) {
			console.log(e)
		}
	}
}
