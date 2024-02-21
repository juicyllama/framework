import { logger } from './logger'
import { LogSeverity, StatsResponse } from '../types/common'
import { QVueGlobals } from 'quasar'
import instance from '../services/index'
import { accountStore } from '../index'
import {
	FormApiOptionsCreate,
	FormApiOptionsDelete,
	FormApiOptionsFindAll,
	FormApiOptionsFindOne,
	FormApiOptionsStats,
	FormApiOptionsUpdate,
} from '../types'

export async function apiRequest<T>(options: {
	url: string
	method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	data?: any
	params?: any
	q?: QVueGlobals,
	headers?: { [key: string]: string }
}): Promise<T> {
	try {
		instance.defaults.headers.common['account-id'] = accountStore.selected_account?.account_id
		instance.defaults.headers.common = { ...instance.defaults.headers.common, ...options.headers }

		let response: any

		let url = options.url

		//clean up params
		for(const key in options.params){
			if(options.params[key] === undefined) delete options.params[key]
			if(typeof options.params[key] === 'boolean'){
				if(options.params[key]) options.params[key] = 1
				else options.params[key] = 0
			}
		}

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
	url: string
	options?: { headers?: { [key: string]: string } }
	constructor(url?: string, options?: { headers?: { [key: string]: string } }) {
		if (url){
			this.url = url;
		}
		this.options = options
	}

	async create(options: FormApiOptionsCreate): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		return await apiRequest<T>({
			url: options.url ?? this.url,
			method: 'POST',
			data: options.data,
			q: options.q,
			headers: this.options?.headers,
		})
	}

	async post(options: FormApiOptionsCreate): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		return this.create({
			url: this.url,
			...options
		})
	}

	async findOne(options?: FormApiOptionsFindOne): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		let url = options?.url ?? this.url
		if (options?.record_id) url = url + `/${options?.record_id}`
		return await apiRequest<T>({
			url: url,
			method: 'GET',
			q: options?.q,
			headers: this.options?.headers,
		})
	}

	async findAll(options?: FormApiOptionsFindAll): Promise<T[]> {
		if(!this.url && !options?.url) throw new Error('No url provided')
		return await apiRequest<T[]>({
			url: options?.url ?? this.url,
			method: 'GET',
			params: options?.find,
			q: options?.q,
			headers: this.options?.headers,
		})
	}

	async get(options?: FormApiOptionsFindAll): Promise<T[]> {
		if(!this.url && !options?.url) throw new Error('No url provided')
		return this.findAll({
			url: this.url,
			...options
		})
	}

	async stats(options?: FormApiOptionsStats): Promise<number> {
		if(!this.url && !options?.url) throw new Error('No url provided')

		const response = await apiRequest<StatsResponse>({
			url: (options?.url ?? this.url) + '/stats',
			method: 'GET',
			params: options?.find,
			q: options?.q,
			headers: this.options?.headers,
		})

		if(!options?.method) return response.count
		
		switch (options.method) {
			case 'SUM':
				return response.sum
			case 'AVG':
				return response.avg
			case 'COUNT':
				return response.count
		}
	}

	async update(options: FormApiOptionsUpdate): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		let url = options.url ?? this.url
		if (options.record_id) url = url + `/${options.record_id}`

		return await apiRequest<T>({
			url: url,
			method: 'PATCH',
			data: options.data,
			q: options.q,
			headers: this.options?.headers,
		})
	}

	async put(options: FormApiOptionsUpdate): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		let url = options.url ?? this.url
		if (options.record_id) url = url + `/${options.record_id}`

		return await apiRequest<T>({
			url: url,
			method: 'PUT',
			data: options.data,
			q: options.q,
			headers: this.options?.headers,
		})
	}

	async patch(options: FormApiOptionsUpdate): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		return this.update({
			url: this.url,
			...options
		})
	}

	async delete(options: FormApiOptionsDelete): Promise<T> {
		if(!this.url && !options.url) throw new Error('No url provided')
		return await apiRequest<T>({
			url: options.url ?? this.url + `/${options.record_id}`,
			method: 'DELETE',
			q: options.q,
			headers: this.options?.headers,
		})
	}
}
