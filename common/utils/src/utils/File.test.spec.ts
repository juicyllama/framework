import { Csv } from './Csv'
import { File } from './File'

const csv = new Csv()
const file = new File()

describe('File', () => {

	it('unlink', async () => {
		const { filePath, dirPath } = await csv.createTempCSVFileFromString(
			'first_name,last_name,email' + '\n' + 'John,Snow,john@got.com'
		)
		expect(filePath).toBeDefined()
		expect(dirPath).toBeDefined()
		
		try{
			await file.unlink(filePath, dirPath)
		}catch(e: any){
			expect(e).toBeUndefined()
		}
	})
})
