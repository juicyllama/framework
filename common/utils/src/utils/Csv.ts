import csvParser from 'csv-parser'
import { Readable } from 'stream'
import * as fs from 'fs'
import * as path from 'path'
import { File }	from './File'

const file = new File()

export class Csv {
	/**
	 * Converts the csv file into an array of objects
	 * @param file
	 * @returns array of objects
	 */

	async parseCsvFile(file: Express.Multer.File): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const results = []
			const stream = Readable.from(file.buffer)

			stream
				.pipe(csvParser())
				.on('data', data => results.push(data))
				.on('end', () => resolve(results))
				.on('error', error => reject(error))
		})
	}

	/**
	 * Create a temporary csv file from a string, useful for testing
	 * @param content string
	 * @returns void
	 */

	async createTempCSVFileFromString(
		content: string,
	): Promise<{ 
		filePath: string, 
		unlink: () => Promise<void>, 
		file: Express.Multer.File,
		dirPath: string,
	}> {
		try {
			const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'))
			const tempFilePath = path.join(tempDir, 'temp-file.csv')
			await fs.promises.writeFile(tempFilePath, content, 'utf-8')

			const temp_file = {
				fieldname: 'temp-file',
				originalname: 'temp-file.csv',
				encoding: '7bit',
				mimetype: 'text/csv',
				buffer: await fs.promises.readFile(tempFilePath),
				size: (await fs.promises.readFile(tempFilePath)).length,
				stream: new Readable(),
				destination: tempFilePath,
				filename: 'temp-file.csv',
				path: tempFilePath,
			}

			return {
				filePath: tempFilePath,
				file: temp_file,
				dirPath: tempDir,
				unlink: async () => {
					file.unlink(tempFilePath, tempDir)
				},
			}
		} catch (error) {
			throw new Error(`Error creating temporary file: ${error}`)
		}
	}
}
