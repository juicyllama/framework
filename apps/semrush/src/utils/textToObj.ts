export function parseTextData(input: string): object[] {
	const lines = input.trim().split('\n')
	const headers = lines[0].split(';').map(header => header.replace(/[\r\n]+/g, '')) // Clean line symbols in headers
	const data = lines.slice(1).map(line => {
		const values = line.split(';').map(value => value.replace(/[\r\n]+/g, '')) // Clean line symbols in each value
		const obj: any = {}
		headers.forEach((header, index) => {
			// transform key to camelCase
			let key = header.replace(/[^a-zA-Z0-9]+(.)/g, (_match, chr) => chr.toUpperCase())
			key = key.charAt(0).toLowerCase() + key.slice(1)

			obj[key] = values[index]
		})
		return obj
	})
	return data
}
