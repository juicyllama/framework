import { RedocOptions } from '@juicyllama/core'

export function installBillingDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'Billing'
	let tags = ['Charges', 'Invoices', 'Payment Methods', 'Subscriptions', 'Wallet', 'Withdrawals']

	if (exclude_tags?.length) {
		tags = tags.filter(tag => !exclude_tags.includes(tag))
	}

	docs.tagGroups ||= []
	docs.tagGroups.push({
		name: group,
		tags: tags,
	})

	return docs
}
