import { Readable } from 'stream'
import { File } from './File.js'

export class Json {
	/**
	 * Converts the json file into a valid json object
	 * @param file
	 * @returns json object
	 */

	static async parseJsonFile(file: Express.Multer.File, mappers?: { [key: string]: string }): Promise<any[]> {
		return new Promise((resolve, reject) => {
			const results = []
			const stream = Readable.from(file.buffer)

			stream
				.on('data', data => results.push(...JSON.parse(data)))
				.on('end', () => resolve(this.changeKeyValues(mappers, results)))
				.on('error', error => reject(error))
		})
	}

	/**
	 * Create a temporary json file from a string, useful for testing
	 * @param content string
	 * @returns void
	 */

	static async createTempJSONFileFromString(content: string): Promise<{
		filePath: string
		json_file: Express.Multer.File
		dirPath: string
	}> {
		const result = await File.createTempFileFromString({
			fileName: 'temp-file.json',
			content: content,
			mimetype: 'application/json',
		})

		return {
			filePath: result.filePath,
			json_file: result.file,
			dirPath: result.dirPath,
		}
	}

	/**
	 * Change the key values of an object
	 * @param mappers object
	 * @param results object
	 * @returns object
	 */

	static changeKeyValues(mappers: { [key: string]: string }, results: any[]): any[] {
		if (mappers) {
			return results.map((result: any) => {
				const newResult: any = {}
				for (const key in result) {
					if (mappers[key]) {
						newResult[mappers[key]] = result[key]
					} else {
						newResult[key] = result[key]
					}
				}
				return newResult
			})
		}
		return results
	}
}
