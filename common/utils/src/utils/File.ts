import * as fs from 'fs'
import { Logger } from './Logger'

const logger = new Logger()

export class File {
	/**
	 * Remove a file and it's directory
	 * @param filePath string
	 * @param dirPath string
	 * @returns void
	 */

	async unlink(filePath?: string, dirPath?: string): Promise<void> {
		try{
			if(dirPath) {
				fs.rmSync(dirPath, { recursive: true, force: true })
			}else if(filePath){
				fs.promises.unlink(filePath)
			}
		}catch(e: any){
			logger.warn(`[@juicyllama/utils::File::unlink] ${e.message}`, {
				filePath: filePath,
				dirPath: dirPath,
				e: e
			})
		}
	}
}
