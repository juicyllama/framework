import { registerAs } from '@nestjs/config'

export default registerAs(
	'slack',
	() =>
		<any>{
			SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
			SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
		},
)
