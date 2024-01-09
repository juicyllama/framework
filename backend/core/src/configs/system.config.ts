import { registerAs } from '@nestjs/config'

export const systemConfig = registerAs(
	'system',
	() =>
		<any>{
			SYSTEM_DEFAULT_CURRENCY: process.env.SYSTEM_DEFAULT_CURRENCY,
			SYSTEM_EMAIL_ADDRESS: process.env.SYSTEM_EMAIL_ADDRESS,
			SYSTEM_EMAIL_NAME: process.env.SYSTEM_EMAIL_NAME,
			BASE_URL_API: process.env.BASE_URL_API,
			BASE_URL_APP: process.env.BASE_URL_APP,
		},
)
