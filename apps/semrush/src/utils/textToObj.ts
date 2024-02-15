export function parseTextData(input: string): object[] {
	const lines = input.trim().split('\n')
	const headers = lines[0].split(';')
	const data = lines.slice(1).map(line => {
		const values = line.split(';')
		const obj: any = {}
		headers.forEach((header, index) => {
			obj[header] = values[index]
		})
		return obj
	})
	return data
}
