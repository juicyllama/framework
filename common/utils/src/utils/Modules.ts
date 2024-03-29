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
	public static readonly shipbob = new Module('@juicyllama/app-shipbob')
	public static readonly slack = new Module('@juicyllama/app-slack')
	public static readonly wise = new Module('@juicyllama/app-wise')
	public static readonly wordpress = new Module('@juicyllama/app-wordpress')
	public static readonly xerocc = new Module('@juicyllama/app-xero-cc')
	public static readonly semrush = new Module('@juicyllama/app-semrush')
	public static readonly googleAnalytics = new Module('@juicyllama/app-google-analytics4')

	//framework lazyload modules
	public static readonly datacache = new Module('@juicyllama/data-cache')

	//non-framework lazyload modules
	public static readonly bugsnag = new Module('@bugsnag/js')
	public static readonly showdown = new Module('showdown')

	/**
	 * Checks if a module is installed
	 * Warning: require.resolve is not working in frontend aps like vue, use installed instead
	 */

	static isInstalled(name: string): boolean {
		// makes it true if used within the app's sandbox
		if (Modules.isCurrentModule(name)) {
			return true
		}

		try {
			const p = require.resolve(name, { paths: require.main?.paths })
			return !!p
		} catch (e: any) {
			const logger = new Logger()
			logger.debug(`[utils::modules::isInstalled] ${e.message}`, e)
			return false
		}
	}

	static async load<T = any>(name: string): Promise<T> {
		if (Modules.isCurrentModule(name)) {
			return require(process.cwd())
		}

		return require.main?.require(name)
	}

	private static isCurrentModule(name: string) {
		return process.env.npm_package_name === name
	}
}
