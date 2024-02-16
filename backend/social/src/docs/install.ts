import { RedocOptions } from '@juicyllama/core'

export function installSocialDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'Social'
	let tags = ['Chat']

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
