import { IsString } from 'class-validator'

export class XeroConfigDto {
	@IsString()
	XERO_CC_CLIENT_ID: string

	@IsString()
	XERO_CC_CLIENT_SECRET: string

	@IsString()
	XERO_CC_DEFAULT_BANK_ACCOUNT_ID: string

	@IsString()
	XERO_CC_WEBHOOK_SIGNING_KEY
}
