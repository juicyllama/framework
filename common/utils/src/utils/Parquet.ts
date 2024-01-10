import { ParquetWriter, ParquetSchema } from 'parquetjs'
import * as fs from 'fs'
import { File } from './File'

export class Parquet {
	/**
	 * Converts an entity and its data to a parquet file
	 */

	static async toParquet<T>(options: {
		schema: Record<string, any>
		data: Record<any, any>[]
		fileName?: string
		rowFunc?: (value: any, key?: string, row?: T) => any
	}): Promise<{ path: string; file: Buffer }> {
		let pSchema: ParquetSchema

		try {
			pSchema = new ParquetSchema(options.schema)
		} catch (e) {
			throw new Error(`Error creating parquet schema: ${e}`)
		}

		//create file
		const tmp = await File.createTempFilePath(options.fileName)

		const writer = await ParquetWriter.openFile(pSchema, tmp.filePath)

		for (const row of options.data) {
			if (options.rowFunc) {
				for (const [key, value] of Object.entries(row)) {
					row[key] = options.rowFunc(value)
				}
			}

			await writer.appendRow(row)
		}
		await writer.close()

		//get the file
		const fileContent = await fs.promises.readFile(tmp.filePath)

		// Return the file
		return {
			path: tmp.filePath,
			file: fileContent,
		}
	}
}
