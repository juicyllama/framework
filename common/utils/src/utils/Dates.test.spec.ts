import { Dates } from './Dates'

describe('Dates', () => {
	describe('Format', () => {
		it('YYYY-MM-DD', async () => {
			const format = Dates.format(new Date('2020-01-01'), 'YYYY-MM-DD')
			expect(format).toEqual('2020-01-01')
		})

		it('YYYY-MM-DD HH:mm:ss', async () => {
			const format = Dates.format(new Date('2020-01-01 00:00:00'), 'YYYY-MM-DD HH:mm:ss')
			expect(format).toEqual('2020-01-01 00:00:00')
		})

		it('MMM DDDo YYYY', async () => {
			const format = Dates.format(new Date('2020-01-01'), 'MMM Do YYYY')
			expect(format).toEqual('Jan 1st 2020')
		})
	})

	describe('Mins Ago', () => {
		it('5 Mins Ago', async () => {
			const ago = Dates.minutesAgo(5)
			const now = new Date()
			expect(Dates.format(ago, 'datetime')).toEqual(Dates.format(new Date(now.getTime() - 5 * 60000), 'datetime'))
		})
	})
})
