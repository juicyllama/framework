import { IsString } from 'class-validator'

export class MailchimpConfigDto {
	@IsString()
	MAILCHIMP_API_KEY!: string

	@IsString()
	MAILCHIMP_SERVER_PREFIX!: string

	@IsString()
	MAILCHIMP_LIST_ID!: string
}
