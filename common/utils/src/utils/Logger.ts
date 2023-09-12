import { Modules } from './Modules'
import { Env } from './Env'

/* eslint @typescript-eslint/no-var-requires: "off" */

export class Logger {
	data(key: string, value: object): void {
		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.isInstalled('@bugsnag/js')) {
				Bugsnag = require('@bugsnag/js')
				Bugsnag.addMetadata(key, value)
			}
		}
		this.verbose(`[${key}]=>${JSON.stringify(value)}`)
	}

	error(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[31m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 5) {
			console.error(colored)
		}

		if (Env.IsNotTest()) {
			//reduce noise (e.g. errors in other applications we cannot control)
			switch (message) {
				case 'Unexpected token o in JSON at position 1':
				case 'Unexpected token o in JSON at position 1SyntaxError: Unexpected token o in JSON at position 1':
					break
				default:
					if (Modules.isInstalled('@bugsnag/js')) {
						const Bugsnag = require('@bugsnag/js')
						Bugsnag.notify(new Error(message))
					}
			}
		}
	}

	warn(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[33m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 4) {
			console.warn(colored)
		}
	}

	log(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[32m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 3) {
			console.log(colored)
		}
	}

	debug(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[35m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (Env.IsNotTest() || Number(process.env.TEST_LOGGING) <= 2) {
			console.debug(colored)
		}
	}

	verbose(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[36m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (Number(process.env.TEST_LOGGING) <= 1) {
			console.debug(colored)
		}
	}

	table(data: any): void {
		if (Env.IsDev()) {
			console.table(data)
		}
	}

	private processParams(message, optionalParams): string {
		try {
			for (const param of optionalParams) {
				switch (typeof param) {
					case 'undefined':
						break
					case 'object':
						try {
							message += ` ${JSON.stringify(param)}`
						} catch (e) {
							message += ` **Logger Error** Failed to read JSON object`
						}
						break
					case 'string':
					case 'boolean':
						message += param
						break
					default:
						this.error(`typeof param of optionalParams ${typeof param} not handled`)
				}
			}
		} catch (e) {
			this.error(e.message)
			if (Modules.isInstalled('@bugsnag/js')) {
				const Bugsnag = require('@bugsnag/js')
				Bugsnag.notify(new Error(e))
			}
		}

		return message
	}
}
