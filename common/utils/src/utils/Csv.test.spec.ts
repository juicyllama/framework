import { Csv } from './Csv'

const csv = new Csv()

describe('CSV', () => {

	it('createTempCSVFileFromString', async () => {
		const { filePath, unlink } = await csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
		)
		expect(filePath).toBeDefined()
		expect(unlink).toBeDefined()
		await unlink()
	})

	it('parseCsvFile', async () => {
		const { unlink, file } = await csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
		)
		const result = await csv.parseCsvFile(file)
		expect(result).toBeDefined()
		expect(result[0]).toBeDefined()
		expect(result[0].first_name).toEqual('John')
		await unlink()
	})
})
