import { Csv } from './Csv'
import { File } from './File'

const csv = new Csv()
const file = new File()

describe('CSV', () => {

	it('createTempCSVFileFromString', async () => {
		const { filePath, dirPath } = await csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
		)
		expect(filePath).toBeDefined()
		await file.unlink(filePath, dirPath)
	})

	it('parseCsvFile', async () => {
		const { csv_file, filePath, dirPath } = await csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
		)
		const result = await csv.parseCsvFile(csv_file)
		expect(result).toBeDefined()
		expect(result[0]).toBeDefined()
		expect(result[0].first_name).toEqual('John')
		await file.unlink(filePath, dirPath)
	})
})
