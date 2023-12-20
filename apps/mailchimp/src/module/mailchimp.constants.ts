import { Inject } from '@nestjs/common'

export const MailchimpClientToken = Symbol('INJECT:MAILCHIMP:CLIENT')

export const InjectMailchimp = () => Inject(MailchimpClientToken)
