import { Countries } from './Countries'

describe('Countries', () => {
	describe('Convert', () => {
		it('convertISO2ToISO3', async () => {
			const ISO3 = Countries.convertISO2ToISO3('US')
			expect(ISO3).toEqual('USA')
		})

		it('countryNameToISO2', async () => {
			const ISO2 = Countries.countryNameToISO2('United States')
			expect(ISO2).toEqual('US')
		})
	})
	describe('Retrieve', () => {
		it('getCountry', async () => {
			const country = Countries.getCountry('US')
			expect(country && country['Country Name']).toEqual('United States')
		})
	})
})
