import { Stopwatch } from './Stopwatch'

const stopwatch = new Stopwatch('test')

describe('Stopwatch', () => {
	it('Run', async () => {
		stopwatch.start()
		await new Promise(resolve => setTimeout(resolve, 100))
		const result = stopwatch.stop()
		expect(result).toBeGreaterThan(0.09)
	})
})
