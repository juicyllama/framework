import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'
import { Logger } from './Logger'
import { Readable } from 'stream'
import { Random } from './Random'
import axios from 'axios'
import * as mimetypes from '../assets/mimetypes.json'

const logger = new Logger()

export class File {
	/**
	 * Remove a file and it's directory
	 * @param filePath string
	 * @param dirPath string
	 * @returns void
	 */

	static async unlink(filePath?: string, dirPath?: string): Promise<void> {
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

	static async createTempFileFromString(options: { fileName: string; mimetype: string; content: string }): Promise<{
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

	static async createTempFilePath(fileName?: string): Promise<{
		filePath: string
		dirPath: string
		fileName: string
	}> {
		try {
			const tempDir = fs.mkdtempSync(path.join(fs.realpathSync('.'), 'temp-'))
			if (!fileName) {
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

	static md5Checksum(file: Buffer): string {
		const hash = crypto.createHash('md5')
		hash.update(file)
		return hash.digest('base64')
	}

	/**
	 * Create a Express.Multer.File file from a base64 string
	 */

	static async createFileFromBase64(base64: string, filename: string): Promise<Express.Multer.File> {
		const buffer = Buffer.from(base64, 'base64')
		const file = {
			fieldname: 'file',
			originalname: filename,
			encoding: '7bit',
			mimetype: this.getMimeType(filename),
			buffer: buffer,
			size: buffer.length,
			stream: new Readable(),
			destination: '',
			filename: filename,
			path: '',
		}

		return file
	}

	static async downloadFile(url: string): Promise<Express.Multer.File> {
		const download = await axios.get(url, { responseType: 'arraybuffer' })
		const filename = url.split('/').pop() || '' // Add default value for filename

		const file = {
			fieldname: 'file',
			originalname: filename,
			encoding: '7bit',
			mimetype: this.getMimeType(filename),
			buffer: download.data,
			size: download.data.length,
			stream: new Readable(),
			destination: '',
			filename: filename,
			path: '',
		}

		return file
	}

	/**
	 * Get mime type from a file name
	 */

	static getMimeType(fileName: string): string {
		const ext = fileName.split('.').pop()
		return ext ? (mimetypes as Record<string, string>)[ext] : 'application/octet-stream'
	}

	/**
	 * Check if a file exists
	 */
	static exists(filePath: string): boolean {
		return fs.existsSync(filePath)
	}

	/**
	 * Read a file
	 */
	static async read(filePath: string): Promise<string> {
		return fs.readFileSync(filePath, 'utf-8')
	}
}
