import { logger } from './logger.js'
import { LogSeverity, StatsResponse } from '../types/common.js'
import { QVueGlobals } from 'quasar'
import instance from '../services/index.js'
import {
	FormApiOptionsCreate,
	FormApiOptionsDelete,
	FormApiOptionsFindAll,
	FormApiOptionsFindOne,
	FormApiOptionsStats,
	FormApiOptionsUpdate,
} from '../types/index.js'
import { StatsMethods } from '@juicyllama/utils'

export async function apiRequest<T>(options: {
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	data?: any
	params?: any
	q?: QVueGlobals
}): Promise<T> {
	try {
		instance.defaults.headers.common['account-id'] = (
			await import('../index.js')
		).accountStore.selected_account.account_id

		let response: any

		let url = options.url

		if (options.params) {
			url += '?' + new URLSearchParams(<any>options.params).toString()
		}

		switch (options.method) {
			case 'POST':
				response = await instance.post(url, options.data)
				logger({
					severity: LogSeverity.LOG,
					message: `Record created successfully`,
					object: response.data,
					q: options.q,
				})
				break

			case 'PUT':
				response = await instance.put(url, options.data)
				logger({
					severity: LogSeverity.LOG,
					message: `Record updated successfully`,
					object: response.data,
					q: options.q,
				})
				break
			case 'PATCH':
				response = await instance.patch(url, options.data)
				logger({
					severity: LogSeverity.LOG,
					message: `Record updated successfully`,
					object: response.data,
					q: options.q,
				})
				break

			case 'GET':
				response = await instance.get(url)
				break
			case 'DELETE':
				response = await instance.delete(url)
				logger({
					severity: LogSeverity.LOG,
					message: `Record deleted successfully`,
					object: response.data,
					q: options.q,
				})
				break
		}

		return response.data
	} catch (e: any) {
		let error_message = e.response?.data?.message ?? e.message

		switch (error_message) {
			case `Cannot read properties of undefined (reading 'data')`:
				error_message = `We're having trouble connecting to the server. Please try again later.`
				break
		}

		logger({
			severity: LogSeverity.ERROR,
			message: <string>e.response?.data?.message ?? e.message,
			table: { ...options.data, ...options.params },
			object: {
				request: { url: options.url, method: options.method, data: options.data, params: options.params },
				e: { response: { data: e.response?.data } },
			},
			q: options.q,
		})
		return Promise.reject(e)
	}
}

export class Api<T> {
	async create(options: FormApiOptionsCreate): Promise<T> {
		return await apiRequest<T>({
			url: options.url,
			method: 'POST',
			data: options.data,
			q: options.q,
		})
	}

	async post(options: FormApiOptionsCreate): Promise<T> {
		return this.create(options)
	}

	async findOne(options: FormApiOptionsFindOne): Promise<T> {
		let url = options.url
		if (options.record_id) url = url + `/${options.record_id}`
		return await apiRequest<T>({
			url: url,
			method: 'GET',
			q: options.q,
		})
	}

	async findAll(options: FormApiOptionsFindAll): Promise<T[]> {
		return await apiRequest<T[]>({
			url: options.url,
			method: 'GET',
			params: options.find,
			q: options.q,
		})
	}

	async get(options: FormApiOptionsFindAll): Promise<T[]> {
		return this.findAll(options)
	}

	async stats(options: FormApiOptionsStats): Promise<number> {
		const response = await apiRequest<StatsResponse>({
			url: options.url + '/stats',
			method: 'GET',
			params: options.find,
			q: options.q,
		})

		switch (options.method) {
			case StatsMethods.COUNT:
				return response.count
			case StatsMethods.SUM:
				return response.sum
			case StatsMethods.AVG:
				return response.avg
		}
	}

	async update(options: FormApiOptionsUpdate): Promise<T> {
		let url = options.url
		if (options.record_id) url = url + `/${options.record_id}`

		return await apiRequest<T>({
			url: url,
			method: 'PATCH',
			data: options.data,
			q: options.q,
		})
	}

	async patch(options: FormApiOptionsUpdate): Promise<T> {
		return this.update(options)
	}

	async delete(options: FormApiOptionsDelete): Promise<T> {
		return await apiRequest<T>({
			url: options.url + `/${options.record_id}`,
			method: 'DELETE',
			q: options.q,
		})
	}
}
