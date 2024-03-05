import { IsString } from 'class-validator'

export class SlackConfigDto {
	@IsString()
	SLACK_SIGNING_SECRET!: string

	@IsString()
	SLACK_BOT_TOKEN!: string
}
