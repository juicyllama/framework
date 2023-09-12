describe('Test Suite', () => {
	beforeAll(async () => {
		if (process.env.NODE_ENV !== 'test') {
			throw new Error(`Test suite should not be ran outside the test environment`)
		}
	})

	describe('Jest Working...', () => {
		it('Test config works and runs tests', async () => {
			const foo = 'bar'
			expect(foo).toBe('bar')
		})
	})

	afterAll(async () => {})
})
