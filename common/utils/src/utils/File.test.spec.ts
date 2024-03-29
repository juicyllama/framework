import { Csv } from './Csv'
import { File } from './File'

describe('File', () => {
	it('unlink', async () => {
		const { filePath, dirPath } = await Csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com',
		)
		expect(filePath).toBeDefined()
		expect(dirPath).toBeDefined()

		try {
			await File.unlink(filePath, dirPath)
		} catch (e: any) {
			expect(e).toBeUndefined()
		}
	})

	it('Download Image', async () => {
		const result = await File.downloadFile(
			'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
		)
		//const result = await Images.downloadImage('https://cdn.juicyllama.com/wp-content/uploads/2021/02/logo-35x35-primary.png')
		expect(result).toBeDefined()
	})
})
