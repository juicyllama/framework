import { RedocOptions } from '@juicyllama/nestjs-redoc'

export function installAppStoreDocs(docs: RedocOptions, exclude_tags?: string[]): RedocOptions {
	const group = 'App Store'
	let tags = ['Apps', 'Installed Apps']

	if (exclude_tags?.length) {
		tags = tags.filter(tag => !exclude_tags.includes(tag))
	}

	docs.tagGroups.push({
		name: group,
		tags: tags,
	})

	return docs
}
