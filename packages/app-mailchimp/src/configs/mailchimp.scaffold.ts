import mailchimp from '@mailchimp/mailchimp_marketing'

export function MailchimpScaffold(MAILCHIMP_API_KEY: string, MAILCHIMP_SERVER_PREFIX: string): any {
	mailchimp.setConfig({
		apiKey: MAILCHIMP_API_KEY,
		server: MAILCHIMP_SERVER_PREFIX,
	})

	return mailchimp
}
