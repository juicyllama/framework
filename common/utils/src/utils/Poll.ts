import axios, { AxiosRequestConfig } from 'axios'
import { Logger } from './Logger'

const logger = new Logger()

export class Poll {
	/**
	 * Runs a poll request and returns the result once successful
	 *
	 * @param {function} validate
	 * @param {string} url
	 * @param {AxiosRequestConfig} config
	 * @param {int} [interval] seconds defaults to 2000
	 * @param {int} [max_attempts] number of attempts before exiting defaults to 10
	 * @param {string} [domain]
	 * @param {string} [uuid]
	 * @return object
	 */

	async url(
		validate: any,
		url: string,
		config?: AxiosRequestConfig,
		interval = 2000,
		max_attempts = 10,
		domain?: string,
		uuid?: string,
	): Promise<any> {
		if (!domain) {
			domain = 'common::poll::url'
		}

		const poll = () => {
			let attempts = 0
			const executePoll = async (resolve: (value: any) => void, reject: (reason?: any) => void) => {
				logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: ${url}`)

				let result

				try {
					result = await axios.get(url, config)
				} catch (e) {
					const error = e as Error // Type assertion to specify the type of 'e' as 'Error'
					logger.warn(`[${domain}][${uuid}] POLL Error: ${error.message}`, {
						error: {
							message: error.message,
							stack: error.stack,
						},
					})
				}

				logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: Response (${result?.status})`, result?.data)

				attempts++

				if (validate(result?.data)) {
					return resolve(result?.data)
				} else if (attempts === max_attempts) {
					return reject('Exceeded max attempts')
				} else {
					setTimeout(executePoll, interval, resolve, reject)
				}
			}
			return new Promise(executePoll)
		}

		return poll()
			.then(result => {
				return result
			})
			.catch(error => {
				throw Error(error)
			})
	}

	/**
	 * Runs a poll request on a function
	 *
	 * @param {function} validate
	 * @param {function} func
	 * @param {int} [interval] seconds defaults to 2000
	 * @param {int} [max_attempts] number of attempts before exiting defaults to 10
	 * @param {string} [domain]
	 * @param {string} [uuid]
	 * @return object
	 */

	async function(
		validate: any,
		func: any,
		interval = 2000,
		max_attempts = 10,
		domain?: string,
		uuid?: string,
	): Promise<any> {
		if (!domain) {
			domain = 'common::poll::function'
		}

		const poll = () => {
			let attempts = 0
			const executePoll = async (resolve: (value: any) => void, reject: (reason?: any) => void) => {
				logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}`, {
					func: func.toString(),
					interval: interval,
					max_attempts: max_attempts,
					domain: domain,
					uuid: uuid,
				})

				let result

				try {
					result = await func()
				} catch (e) {
					const error = e as Error // Type assertion to specify the type of 'e' as 'Error'
					logger.warn(`[${domain}][${uuid}] POLL Error: ${error.message}`, {
						error: {
							message: error.message,
							stack: error.stack,
						},
					})
				}

				logger.debug(`[${domain}][${uuid}]} POLL #${attempts + 1}: Response`, {
					result: result,
					validate: validate.toString(),
				})

				attempts++

				if (validate(result)) {
					return resolve(result)
				} else if (attempts === max_attempts) {
					return reject('Exceeded max attempts')
				} else {
					setTimeout(executePoll, interval, resolve, reject)
				}
			}
			return new Promise(executePoll)
		}

		return poll()
			.then(result => {
				return result
			})
			.catch(e => {
				logger.warn(`[${domain}][${uuid}] POLL Error: ${e.message}`, {
					error: {
						message: e.message,
						stack: e.stack,
					},
				})
			})
	}
}
