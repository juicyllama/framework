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
			return false
		}
	}
}
