import axios, { RawAxiosRequestConfig } from 'axios'
import { Logger } from './Logger'

const logger = new Logger()

export class Api {
	/**
	 * Performs the get command when expecting an object response
	 *
	 * @param {string} domain
	 * @param {string} url
	 * @param {RawAxiosRequestConfig} [config]
	 * @param {string} [uuid]
	 * @param {any} [interceptor]
	 * @return object
	 */

	async get(domain: string, url: string, config?: any, uuid?: string, interceptor?: any): Promise<any | boolean> {
		if (!config) {
			config = this.defaultConfig()
		}

		try {
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (GET): ${url}`)

			let response

			if (interceptor) {
				const client = axios.create()
				client.interceptors.request.use(interceptor)
				response = await client.get(url, config)
			} else {
				response = await axios.get(url, config)
			}

			logger.debug(
				`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status} length=${
					response.data?.length || 0
				}`,
			)
			logger.verbose(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response data`, response.data)

			return response.data
		} catch (e) {
			return this.processError(e, 'GET', url, domain, config, undefined, uuid)
		}
	}

	/**
	 * Performs the post command when expecting an object response
	 *
	 * @param {string} domain
	 * @param {string} url
	 * @param {object} [data]
	 * @param {RawAxiosRequestConfig} [config]
	 * @param {string} [uuid]
	 * @return object
	 */

	async post(domain: string, url: string, data?: object, config?: any, uuid?: string): Promise<any | boolean> {
		if (!config) {
			config = this.defaultConfig()
		}

		try {
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Request (POST): ${url}`, data)
			const response = await axios.post(url, data, config)
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data)
			return response.data
		} catch (e) {
			return this.processError(e, 'POST', url, domain, config, data, uuid)
		}
	}

	/**
	 * Performs the patch command when expecting an object response
	 *
	 * @param {string} domain
	 * @param {string} url
	 * @param {object} [data]
	 * @param {RawAxiosRequestConfig} [config]
	 * @param {string} [uuid]
	 * @return object
	 */

	async patch(domain: string, url: string, data?: object, config?: any, uuid?: string): Promise<any | boolean> {
		if (!config) {
			config = this.defaultConfig()
		}

		try {
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PATCH): ${url}`, data)
			const response = await axios.patch(url, data, config)
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data)
			return response.data
		} catch (e) {
			return this.processError(e, 'PATCH', url, domain, config, data, uuid)
		}
	}

	/**
	 * Performs the put command when expecting an object response
	 *
	 * @param {string} domain
	 * @param {string} url
	 * @param {object} [data]
	 * @param {RawAxiosRequestConfig} [config]
	 * @param {string} [uuid]
	 * @return object
	 */

	async put(domain: string, url: string, data?: object, config?: any, uuid?: string): Promise<any | boolean> {
		if (!config) {
			config = this.defaultConfig()
		}
		try {
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (PUT): ${url}`, data)
			const response = await axios.put(url, data, config)
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data)
			return response.data
		} catch (e) {
			return this.processError(e, 'PUT', url, domain, config, data, uuid)
		}
	}

	/**
	 * Performs the get command when expecting an object response
	 *
	 * @param {string} domain
	 * @param {string} url
	 * @param {RawAxiosRequestConfig} [config]
	 * @param {string} [uuid]
	 * @return object
	 */

	async delete(domain: string, url: string, config?: any, uuid?: string): Promise<boolean> {
		if (!config) {
			config = this.defaultConfig()
		}

		try {
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''}} Request (DELETE): ${url}`)
			const response = await axios.delete(url, config)
			logger.debug(`[${domain}]${uuid ? '[' + uuid + ']' : ''} Response ${response.status}`, response.data)
			return true
		} catch (e) {
			return this.processError(e, 'DELETE', url, domain, config, undefined, uuid)
		}
	}

	defaultConfig(): RawAxiosRequestConfig {
		return {
			headers: {
				'Content-Type': 'application/json',
				'Accept-Encoding': 'application/json',
			},
		}
	}

	processError(e: any, method: string, url: string, domain?: string, config?: any, data?: object, uuid?: string) {
		const message = `[${domain}]${uuid ? '[' + uuid + ']' : ''} Error (${
			e.response && e.response.status ? e.response.status : null
		}): ${e.message}`
		const debug = {
			request: {
				method: method,
				url: url,
				config: config ?? null,
				data: data ?? null,
			},
			response: e.response
				? {
						status: e.response.status,
						data: e.response.data,
					}
				: null,
			error: {
				status: e.status,
				message: e.message,
				stack: e.stack,
			},
		}
		logger.warn(message, debug)
		return false
	}
}
