import { RedocOptions } from '@juicyllama/nestjs-redoc'

export function installEcommerceDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'Ecommerce'
	let tags = ['Stores', 'Transactions', 'Discounts']

	if (exclude_tags?.length) {
		tags = tags.filter(tag => !exclude_tags.includes(tag))
	}

	docs.tagGroups.push({
		name: group,
		tags: tags,
	})

	return docs
}
