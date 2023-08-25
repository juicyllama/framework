import { registerAs } from '@nestjs/config'

export const ssoConfig = registerAs(
	'sso',
	() =>
		<any>{
			FACEBOOK_APP_ID: process.env.FACEBOOK_APP_ID,
			FACEBOOK_APP_SECRET: process.env.FACEBOOK_APP_SECRET,
			GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
			AZURE_AD_CLIENT_ID: process.env.AZURE_AD_CLIENT_ID,
			AZURE_AD_TENANT_ID: process.env.AZURE_AD_TENANT_ID,
		},
)
