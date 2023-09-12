export function stripPx(s: string): string {
	if (!s) {
		return ''
	}
	return s.replace('px', '')
}

export function short(s: string) {
	if (!s) {
		return ''
	}

	return s
		.split(/\s/)
		.reduce((response, word) => (response += word.slice(0, 1)), '')
		.toUpperCase()
}
