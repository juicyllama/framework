import { Api } from './Api'

const api = new Api()

describe('API', () => {
	it('Get', async () => {
		const result = await api.get('test', 'https://jsonplaceholder.typicode.com/posts/1')
		expect(result).toBeDefined()
	})
})
