import { RedocOptions } from '@juicyllama/core'

export function installCRMDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'CRM'
	let tags = ['Contacts']

	if (exclude_tags?.length) {
		tags = tags.filter(tag => !exclude_tags.includes(tag))
	}

	docs.tagGroups.push({
		name: group,
		tags: tags,
	})

	return docs
}
