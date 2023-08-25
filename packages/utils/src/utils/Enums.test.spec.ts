import { Enums } from './Enums'

enum example {
	VIEWER_WITHOUT_REVENUE = 1,
	VIEWER = 3,
	MEMBER = 5,
	ADMIN = 7,
	OWNER = 9,
}

enum example2 {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
}

describe('Enums', () => {
	it('getKeyName', async () => {
		const getKeyName = Enums.getKeyName(example, 1)
		expect(getKeyName).toEqual('VIEWER_WITHOUT_REVENUE')
	})

	it('toArray', async () => {
		const toArray = Enums.toArray(example, 'key', 'value')
		expect(toArray).toEqual([
			{ key: 'VIEWER_WITHOUT_REVENUE', value: 1 },
			{ key: 'VIEWER', value: 3 },
			{ key: 'MEMBER', value: 5 },
			{ key: 'ADMIN', value: 7 },
			{ key: 'OWNER', value: 9 },
		])
	})

	it('toArray', async () => {
		const toArray = Enums.toArray(example2, 'key', 'value')
		expect(toArray).toEqual([
			{ key: 'USD', value: 'USD' },
			{ key: 'EUR', value: 'EUR' },
			{ key: 'GBP', value: 'GBP' },
		])
	})
})
