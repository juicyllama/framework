import { Modules } from './Modules'
import { Env } from './Env'

/* eslint @typescript-eslint/no-var-requires: "off" */

const DEFAULT_LOG_LEVEL = 3

export class Logger {
	data(key: string, value: object): void {
		if (Env.IsNotTest()) {
			let Bugsnag: any

			if (Modules.bugsnag.isInstalled) {
				Bugsnag = Modules.bugsnag.load()
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

		if (this.getLogLevel() <= 5) {
			console.error(colored)
		}

		if (Env.IsNotTest()) {
			//reduce noise (e.g. errors in other applications we cannot control)
			switch (message) {
				case 'Unexpected token o in JSON at position 1':
				case 'Unexpected token o in JSON at position 1SyntaxError: Unexpected token o in JSON at position 1':
					break
				default:
					if (Modules.bugsnag.isInstalled) {
						Modules.bugsnag.load().then(Bugsnag => {
							Bugsnag.notify(new Error(message))
						})
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

		if (this.getLogLevel() <= 4) {
			console.warn(colored)
		}
	}

	log(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[32m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (this.getLogLevel() <= 3) {
			console.log(colored)
		}
	}

	debug(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[35m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (this.getLogLevel() <= 2) {
			console.debug(colored)
		}
	}

	verbose(message: any, ...optionalParams: [...any, string?]): void {
		let colored = `\x1b[36m`
		if (optionalParams) {
			message = this.processParams(message, optionalParams)
		}
		colored += `${message}\x1b[0m`

		if (this.getLogLevel() <= 1) {
			console.debug(colored)
		}
	}

	status(): void {
		this.log(`--------- Logging Status ---------`)
		this.log(`LOG_LEVEL=${this.getLogLevel()}`)
		this.error(`This is an error`)
		this.warn(`This is a warning`)
		this.log(`This is a log`)
		this.debug(`This is a debug`)
		this.verbose(`This is a verbose`)
		this.log(`------- Logging Status End -------`)
	}

	table(data: any): void {
		if (Env.IsDev()) {
			console.table(data)
		}
	}
	private getLogLevel(): number {
		return process.env.LOG_LEVEL ? Number(process.env.LOG_LEVEL) : DEFAULT_LOG_LEVEL
	}

	private processParams(message: string, optionalParams: any[]): string {
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
			this.error((e as Error).message)
			if (Modules.bugsnag.isInstalled) {
				Modules.bugsnag.load().then(Bugsnag => {
					return Bugsnag.notify(new Error(e as string))
				})
			}
		}

		return message
	}
}
