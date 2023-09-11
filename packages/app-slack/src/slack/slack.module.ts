import { Module } from '@nestjs/common'
import { SlackService } from './slack.service'
import { SlackChatService } from './slack.chat.service'
import { Env, Logger } from '@juicyllama/utils'
import slackConfig from '../config/slack.config'
import { slackConfigJoi } from '../config/slack.config.joi'
import Joi from 'joi'
import { ConfigModule } from '@nestjs/config'

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [slackConfig],
			isGlobal: true,
			envFilePath: '.env',
			validationSchema: Env.IsNotTest() ? Joi.object(slackConfigJoi) : null,
		}),
	],
	controllers: [],
	providers: [SlackService, SlackChatService, Logger],
	exports: [SlackService],
})
export class SlackModule {}
