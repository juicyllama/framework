import { Api } from './Api'

const api = new Api()

describe('API', () => {
	it('Get', async () => {
		const result = await api.get(`test`, `https://api.publicapis.org/entries`)
		expect(result).toBeDefined()
	})
})
