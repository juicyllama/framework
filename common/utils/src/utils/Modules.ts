import { Logger } from './Logger'

class Module<T = any> {
	constructor(public readonly name: string) {}

	public get isInstalled() {
		return Modules.isInstalled(this.name)
	}

	public async load() {
		return Modules.load<T>(this.name)
	}
}

export class Modules {
	public static readonly appAws = new Module('@juicyllama/app-aws');

	/**
	 * Checks if a module is installed
	 *
	 * Warning: require.resolve is not working in frontend aps like vue, use installed instead
	 */

	static isInstalled(name: string): boolean {
		try {
			const p = require.resolve(name, { paths: require.main.paths })
			return !!p
		} catch (e: any) {
			const logger = new Logger()
			logger.debug(`[utils::modules::isInstalled] ${e.message}`, e)
			return false
		}
	}

	static async load<T = any>(name: string): Promise<T> {
		return require.main.require(name)
	}
}
