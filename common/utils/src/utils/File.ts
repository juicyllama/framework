import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { Logger } from './Logger'
import { Readable } from 'stream'
import { Random } from './Random'

const logger = new Logger()

export class File {
	/**
	 * Remove a file and it's directory
	 * @param filePath string
	 * @param dirPath string
	 * @returns void
	 */

	async unlink(filePath?: string, dirPath?: string): Promise<void> {
		try {
			if (dirPath) {
				fs.rmSync(dirPath, { recursive: true, force: true })
			} else if (filePath) {
				fs.promises.unlink(filePath)
			}
		} catch (e: any) {
			logger.warn(`[@juicyllama/utils::File::unlink] ${e.message}`, {
				filePath: filePath,
				dirPath: dirPath,
				e: e,
			})
		}
	}

	/**
	 * Create a temporary file from a string, useful for testing
	 * @param content string
	 * @returns void
	 */

	async createTempFileFromString(options: { fileName: string; mimetype: string; content: string }): Promise<{
		filePath: string
		file: Express.Multer.File
		dirPath: string
	}> {
		try {
			const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'))
			const tempFilePath = path.join(tempDir, options.fileName)
			await fs.promises.writeFile(tempFilePath, options.content, 'utf-8')

			const temp_file = {
				fieldname: options.fileName.split('.')[0],
				originalname: options.fileName,
				encoding: '7bit',
				mimetype: options.mimetype,
				buffer: await fs.promises.readFile(tempFilePath),
				size: (await fs.promises.readFile(tempFilePath)).length,
				stream: new Readable(),
				destination: tempFilePath,
				filename: options.fileName,
				path: tempFilePath,
			}

			return {
				filePath: tempFilePath,
				file: temp_file,
				dirPath: tempDir,
			}
		} catch (error) {
			throw new Error(`Error creating temporary file: ${error}`)
		}
	}


	/**
	 * Create a temporary file from a string, useful for testing
	 * @param content string
	 * @returns void
	 */

	async createTempFilePath(fileName?: string): Promise<{
		filePath: string
		dirPath: string
		fileName: string
	}> {
		try {
			const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'))
			if(!fileName){
				fileName = Random.String(10)
			}
			
			return {
				filePath: path.join(tempDir, fileName),
				dirPath: tempDir,
				fileName: fileName,
			}	
		} catch (error) {
			throw new Error(`Error creating temporary file path: ${error}`)
		}
	}

	/**
	 * Get the md5Checksum of a file
	 */

	md5Checksum(file: Buffer): string {
		const hash = crypto.createHash('md5');
		hash.update(file);
		return hash.digest('base64');
	}

	/**
	 * Create a Express.Multer.File file from a base64 string
	 */

	async createFileFromBase64(base64: string, filename: string): Promise<Express.Multer.File> {

		let mimetype

		if(filename.endsWith('.png')){
			mimetype = 'image/x-png'
		}

		const buffer = Buffer.from(base64, 'base64')
		const file = {
			fieldname: 'file',
			originalname: filename,
			encoding: '7bit',
			mimetype: mimetype,
			buffer: buffer,
			size: buffer.length,
			stream: new Readable(),
			destination: '',
			filename: filename,
			path: '',
		}

		return file
	}

}
