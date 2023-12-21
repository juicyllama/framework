import { ConfigValidationModule, getConfigToken } from '@juicyllama/core'
import { Logger } from '@juicyllama/utils'
import { Module } from '@nestjs/common'
import { App } from '@slack/bolt'
import { SlackConfigDto } from '../config/slack.config.dto'
import { SlackChatService } from './slack.chat.service'
import { SlackService } from './slack.service'
import { SlackBoltClientToken } from './slack.constants'

@Module({
	imports: [ConfigValidationModule.register(SlackConfigDto)],
	controllers: [],
	providers: [
		SlackService,
		SlackChatService,
		Logger,
		{
			provide: SlackBoltClientToken,
			inject: [getConfigToken(SlackConfigDto)],
			useFactory: (config: SlackConfigDto) =>
				new App({
					signingSecret: config.SLACK_SIGNING_SECRET,
					token: config.SLACK_BOT_TOKEN,
				}),
		},
	],
	exports: [SlackService],
})
export class SlackModule {}
