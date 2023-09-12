import { ApiMode, Mandate, MandateStatus, MandateMethod } from '@mollie/api-client'

export default function (): Mandate {
	//@ts-ignore
	return {
		resource: 'mandate',
		id: 'mdt_h3gAaD5zP',
		mode: ApiMode.test,
		status: MandateStatus.valid,
		method: MandateMethod.creditcard,
		details: {
			cardHolder: 'John Doe',
			cardNumber: '4242',
			cardLabel: 'Visa',
			cardFingerprint: 'foo',
			// @ts-ignore
			cardExpiryDate: '2030-12-31',
		},
		mandateReference: 'YOUR-COMPANY-MD13804',
		signatureDate: '2018-05-07',
		createdAt: '2018-05-07T10:49:08+00:00',
		_links: {
			self: {
				href: 'https://api.mollie.com/v2/customers/cst_4qqhO89gsT/mandates/mdt_h3gAaD5zP',
				type: 'application/hal+json',
			},
			customer: {
				href: 'https://api.mollie.com/v2/customers/cst_4qqhO89gsT',
				type: 'application/hal+json',
			},
			documentation: {
				href: 'https://docs.mollie.com/reference/v2/mandates-api/create-mandate',
				type: 'text/html',
			},
		},
	}
}
