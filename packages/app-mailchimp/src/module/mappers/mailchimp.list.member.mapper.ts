import { AddListMemberBody } from '@mailchimp/mailchimp_marketing'
import { isNil, omitBy } from 'lodash'

/**
 * Converts a CRM contact to a mailchimp list member
 */

export function mapperContactToMember(contact: any): AddListMemberBody {
	const merge_fields = omitBy(
		{
			FNAME: contact?.first_name ?? null,
			LNAME: contact?.last_name ?? null,
			PHONE: contact?.phones ? contact.phones[0]?.number : null,
			ADDRESS: contact?.addresses
				? contact.addresses[0]?.address_1 + ' ' + contact.addresses[0]?.address_2
				: null,
			CITY: contact?.addresses ? contact.addresses[0]?.city : null,
			STATE: contact?.addresses ? contact.addresses[0]?.state : null,
			ZIP: contact?.addresses ? contact.addresses[0]?.post_code : null,
			COUNTRY: contact?.addresses ? contact.addresses[0]?.country_iso : null,
		},
		isNil,
	)

	return {
		email_address: contact?.emails[0]?.email,
		status: 'subscribed',
		merge_fields: merge_fields,
		tags: contact?.tags?.map((tag) => tag.name),
	}
}
