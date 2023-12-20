import { Payment, ApiMode, SequenceType, PaymentStatus, PaymentMethod } from '@mollie/api-client'
import { DeepPartial } from 'typeorm'
import { MolliePayment } from './payment.entity'

export default function (data: DeepPartial<MolliePayment>): Payment {
	return {
		resource: 'payment',
		id: 'tr_7UhSN1zuXS',
		mode: ApiMode.test,
		createdAt: '2018-03-20T09:13:37+00:00',
		amount: {
			value: data.amount.toString(),
			currency: data.currency,
		},
		metadata: <any>{
			account_id: data.customer.account.account_id,
			customer_id: data.customer.mollie_customer_id,
		},
		method: PaymentMethod.creditcard,
		customerId: data.customer.ext_customer_id,
		sequenceType: SequenceType.first,
		status: PaymentStatus.open,
		isCancelable: false,
		expiresAt: '2018-03-20T09:28:37+00:00',
		details: null,
		profileId: 'pfl_QkEhN94Ba',
		cusotmerId: 'cst_8wmqcHMN4U',
		mandateId: 'mdt_h3gAaD5zP',
		redirectUrl: 'https://webshop.example.org/order/12345/',
		webhookUrl: 'https://webshop.example.org/payments/webhook/',
		_links: {
			self: {
				href: 'https://api.mollie.com/v2/payments/tr_7UhSN1zuXS',
				type: 'application/json',
			},
			checkout: {
				href: 'https://www.mollie.com/payscreen/select-method/7UhSN1zuXS',
				type: 'text/html',
			},
			// @ts-ignore
			dashboard: {
				href: 'https://www.mollie.com/dashboard/org_12345678/payments/tr_7UhSN1zuXS',
				type: 'application/json',
			},
			documentation: {
				href: 'https://docs.mollie.com/reference/v2/payments-api/create-payment',
				type: 'text/html',
			},
		},
	}
}
