import { Account } from '@juicyllama/core'
import { Address, Contact, CurrencyCode } from 'xero-node'

/**
 * Takes an account object and converts it to a xero contact object
 *
 * @param account
 */

export function accountToContact(account: Account): Contact {
	let account_name = account.company_name ?? account.account_name
	account_name += ` (#${account.account_id})`

	return {
		name: account_name,
		accountNumber: account.account_id.toString(),
		emailAddress: account.finance_email,
		isCustomer: true,
		defaultCurrency: CurrencyCode[account.currency],
		addresses:
			account.address_1 && account.country
				? [
						{
							addressType: Address.AddressTypeEnum.STREET,
							addressLine1: account.address_1,
							addressLine2: account.address_2,
							city: account.city,
							postalCode: account.postcode,
							region: account.state,
							country: account.country,
						},
				  ]
				: null,
	}
}
