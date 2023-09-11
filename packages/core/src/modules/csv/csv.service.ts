import { Injectable } from '@nestjs/common'
import csvParser from 'csv-parser'
import { Readable } from 'stream'

@Injectable()
export class CsvService {
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
}
