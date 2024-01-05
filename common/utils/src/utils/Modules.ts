import { Logger } from './Logger.js'

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
	//framework app lazyload modules
	public static readonly apilayer = new Module('@juicyllama/app-apilayer')
	public static readonly aws = new Module('@juicyllama/app-aws')
	public static readonly everflow = new Module('@juicyllama/app-everflow')
	public static readonly mailchimp = new Module('@juicyllama/app-mailchimp')
	public static readonly mollie = new Module('@juicyllama/app-mollie')
	public static readonly openai = new Module('@juicyllama/app-openai')
	public static readonly pexels = new Module('@juicyllama/app-pexels')
	public static readonly scrapingbee = new Module('@juicyllama/app-scrapingbee')
	public static readonly shopify = new Module('@juicyllama/app-shopify')
	public static readonly slack = new Module('@juicyllama/app-slack')
	public static readonly wise = new Module('@juicyllama/app-wise')
	public static readonly wordpress = new Module('@juicyllama/app-wordpress')
	public static readonly xerocc = new Module('@juicyllama/app-xero-cc')

	//framework lazyload modules
	public static readonly datacache = new Module('@juicyllama/data-cache')

	//non-framework lazyload modules
	public static readonly bugsnag = new Module('@bugsnag/js')
	public static readonly pusher = new Module('pusher')
	public static readonly showdown = new Module('showdown')

	/**
	 * Checks if a module is installed
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
