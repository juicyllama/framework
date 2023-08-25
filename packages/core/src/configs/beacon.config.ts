import { registerAs } from '@nestjs/config'

export default registerAs(
	'beacon',
	() =>
		<any>{
			SYSTEM_EMAIL_ADDRESS: process.env.SYSTEM_EMAIL_ADDRESS,
			SYSTEM_EMAIL_NAME: process.env.SYSTEM_EMAIL_NAME,
			PUSHER_APP_ID: process.env.PUSHER_APP_ID,
			PUSHER_APP_KEY: process.env.PUSHER_APP_KEY,
			PUSHER_APP_SECRET: process.env.PUSHER_APP_SECRET,
			PUSHER_APP_CLUSTER: process.env.PUSHER_APP_CLUSTER,
			PUSHER_USE_TLS: process.env.PUSHER_USE_TLS,
			PUSHER_CHANNEL: process.env.PUSHER_CHANNEL,
		},
)
