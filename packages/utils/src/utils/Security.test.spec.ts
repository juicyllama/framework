import { Security } from './Security'

describe('Security', () => {
	it('hashPassword', async () => {
		const hash = Security.hashPassword('test')
		expect(hash).toBeDefined()
		expect(hash).toEqual(
			'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
		)
		const rehash = Security.hashPassword(hash)
		expect(rehash).toBeDefined()
		expect(rehash).toEqual(
			'ee26b0dd4af7e749aa1a8ee3c10ae9923f618980772e473f8819a5d4940e0db27ac185f8a0e1d5f84f88bc887fd67b143732c304cc5fa9ad8e6f57f50028a8ff',
		)
	})
})
