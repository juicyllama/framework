import { Api } from './Api.js'

const api = new Api()

describe('API', () => {
	it('Get', async () => {
		const result = await api.get(`test`, `https://api.publicapis.org/entries`)
		expect(result).toBeDefined()
	})
})
