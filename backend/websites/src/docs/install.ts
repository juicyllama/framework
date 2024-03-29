import { RedocOptions } from '@juicyllama/core'

export function installWebsiteDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'Websites'
	let tags = ['Websites']

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
