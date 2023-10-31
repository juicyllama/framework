import { Logger } from './Logger'

export class Modules {
	/**
	 * Checks if a module is installed
	 *
	 * Warning: require.resolve is not working in frontend aps like vue, use installed instead
	 */

	static isInstalled(name: string): boolean {
		try {
			const p = require.resolve(name)
			return !!p
		} catch (e: any) {
			const logger = new Logger()
			logger.debug(`[utils::modules::isInstalled] ${e.message}`, e)
			return false
		}
	}
	
}
