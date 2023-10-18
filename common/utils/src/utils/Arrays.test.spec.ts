import { Arrays } from './Arrays'

const arrays = new Arrays()

describe('Arrays', () => {
	it('replaceObjectKeys', async () => {
		
		let array = [
			<any>{ name: 'Tom', type: 'Cat' },
			<any>{ name: 'Jerry', type: 'Mouse' },
		]
		
		array = arrays.replaceObjectKeys(array, { type: 'animal' })
		
		expect(array).toBeDefined()
		expect(array[0]).toBeDefined()
		expect(array[0].name).toBeDefined()
		expect(array[0].type).not.toBeDefined()
		expect(array[0].animal).toBeDefined()
		expect(array[0].animal).toBe('Cat')
		expect(array[1]).toBeDefined()
		expect(array[0].name).toBeDefined()
		expect(array[1].type).not.toBeDefined()
		expect(array[1].animal).toBeDefined()
		expect(array[1].animal).toBe('Mouse')
	})
})
