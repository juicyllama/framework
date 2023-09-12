import { registerAs } from '@nestjs/config'

export default registerAs(
	'xero_cc',
	() =>
		<any>{
			XERO_CC_CLIENT_ID: process.env.XERO_CC_CLIENT_ID,
			XERO_CC_CLIENT_SECRET: process.env.XERO_CC_CLIENT_SECRET,
			XERO_CC_DEFAULT_BANK_ACCOUNT_ID: process.env.XERO_CC_DEFAULT_BANK_ACCOUNT_ID,
			XERO_CC_WEBHOOK_SIGNING_KEY: process.env.XERO_CC_WEBHOOK_SIGNING_KEY,
		},
)
