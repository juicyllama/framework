import { Objects } from './Objects'

describe('Objects', () => {
	it('clean', async () => {
		const object = {
			a: 'a',
			b: undefined,
			c: 'undefined',
			d: '',
		}

		const cleaned = Objects.clean(object)
		expect(cleaned).toEqual({ a: 'a' })
	})
})
