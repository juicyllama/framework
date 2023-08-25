export const tagToHtml = (tag: string): string => {
	if (!tag) return ''
	return `<q-badge class='JLBadge JLTagBadge JLTag${tag}' >${tag.replace('_', ' ')}</q-badge>`
}
