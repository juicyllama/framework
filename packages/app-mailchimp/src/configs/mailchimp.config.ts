import { registerAs } from '@nestjs/config'

export default registerAs(
	'mailchimp',
	() =>
		<any>{
			MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
			MAILCHIMP_SERVER_PREFIX: process.env.MAILCHIMP_SERVER_PREFIX,
			MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
		},
)
