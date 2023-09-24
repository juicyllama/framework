import request from 'supertest'
import { Account } from '../modules/accounts/account.entity.js'
import { Logger, StatsMethods } from '@juicyllama/utils'
import { DeepPartial } from 'typeorm'
import { ScaffoldDto } from './scaffold.js'
import { METHOD } from '../types/index.js'
import * as querystring from 'querystring'

//todo is there a way to pass the request type dynamically to merge some of these switch statements?

export async function TestEndpoint<T>(options: {
	type: METHOD
	scaffold: ScaffoldDto<T>
	url: string
	PRIMARY_KEY?: string
	data?: Partial<T> | DeepPartial<T>
	attach?: {
		field: string
		file: any
	}
	queryParams?: { [key: string]: any }
	primaryKey?: number
	access_token?: string // If not provided, will use owner_access_token
	account?: Account // If not provided, will use owner_account
	emitCheckResultKeys?: string[] //if values are not provided back in the result
	skipResultCheck?: boolean // if true results will be returned without checking
}): Promise<T> {
	let E: T

	const headers = {
		Authorization: 'Bearer ' + (options.access_token ?? options.scaffold.values.owner_access_token),
		'account-id': options.account
			? options.account.account_id.toString()
			: options.scaffold.values.account.account_id.toString(),
	}

	switch (options.type) {
		case METHOD.CREATE:
		case METHOD.POST:
			const requestBuilder = request(options.scaffold.server)
				.post(options.url)
				.set(headers)
				.send(<any>options.data)
			if (options.attach) {
				requestBuilder.attach(options.attach.field, options.attach.file)
			}
			await requestBuilder
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[options.PRIMARY_KEY]).toBeDefined()
						}
						options.skipResultCheck || checkResult<T>(<any>options.data, body, options.emitCheckResultKeys)
						E = body
					} catch (e: any) {
						E = body
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})
			return E

		case METHOD.UPDATE:
		case METHOD.PATCH:
			await request(options.scaffold.server)
				.patch(options.url)
				.set(headers)
				.send(<any>options.data)
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[options.PRIMARY_KEY]).toBeDefined()
						}
						checkResult<T>(<any>options.data, body, options.emitCheckResultKeys)
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})
			return E

		case METHOD.PUT:
			await request(options.scaffold.server)
				.put(options.url)
				.set(headers)
				.send(<any>options.data)
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[options.PRIMARY_KEY]).toBeDefined()
						}
						checkResult<T>(<any>options.data, body, options.emitCheckResultKeys)
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})
			return E

		case METHOD.GET:
			await request(options.scaffold.server)
				.get(options.url)
				.set(headers)
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[options.PRIMARY_KEY]).toBeDefined()
						}
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})
			return E

		case METHOD.LIST:
			let urlWithQueryString: string

			if (options.queryParams) {
				urlWithQueryString = `${options.url}?${Object.keys(options.queryParams)
					.map(key => `${key}=${options.queryParams[key]}`)
					.join('&')}`
			}
			await request(options.scaffold.server)
				.get(urlWithQueryString ?? options.url)
				.set(headers)
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[0][options.PRIMARY_KEY]).toBeTruthy()
						}
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})

			return E

		case METHOD.COUNT:
			await request(options.scaffold.server)
				.get(`${options.url}/stats?method=${StatsMethods.COUNT}`)
				.set(headers)
				.then(async ({ body }) => {
					try {
						expect(body.count).toBeGreaterThan(0)
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})

			return E

		case METHOD.CHARTS:
			const chartsUrl = `${options.url}/charts?${querystring.stringify(options.queryParams)}`
			await request(options.scaffold.server)
				.get(chartsUrl)
				.set(headers)
				.then(async ({ body }) => {
					try {
						expect(body.datasets.length).toBeGreaterThan(0)
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})

			return E

		case METHOD.DELETE:
			await request(options.scaffold.server)
				.delete(options.url)
				.set(headers)
				.then(async ({ body }) => {
					try {
						if (options.PRIMARY_KEY) {
							expect(body[options.PRIMARY_KEY]).toBeDefined()
						}
						E = body
					} catch (e: any) {
						outputError<T>({
							error: e,
							response: body,
							...options,
						})
					}
				})
				.catch(async e => {
					outputError<T>({
						error: e,
						...options,
					})
				})
			return E
	}
}

export async function TestService<T>(options: {
	type: METHOD
	scaffold: ScaffoldDto<T>
	mock?: DeepPartial<T>
	PRIMARY_KEY?: string
	record?: T
}): Promise<T> {
	let E: T

	switch (options.type) {
		case METHOD.CREATE:
			try {
				E = await options.scaffold.services.service.create(options.mock)
				expect(E[options.PRIMARY_KEY]).toBeDefined()
				checkResult<T>(<any>options.mock, E)
				return E
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}

			break

		case METHOD.LIST:
			try {
				E = await options.scaffold.services.service.findAll()
				expect(E[0][options.PRIMARY_KEY]).toBeDefined()
				checkResult<T>(<any>options.mock, E[0])
				return E
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}

			break

		case METHOD.GET:
			try {
				E = await options.scaffold.services.service.findOne()
				expect(E[options.PRIMARY_KEY]).toBeDefined()
				checkResult<T>(<any>options.mock, E)
				return E
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}

			break

		case METHOD.COUNT:
			try {
				E = await options.scaffold.services.service.count()
				expect(E).toBeDefined()
				expect(E).toBeGreaterThan(0)
				return E
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}

			break

		case METHOD.PATCH:
		case METHOD.UPDATE:
			try {
				E = await options.scaffold.services.service.update({
					[options.PRIMARY_KEY]: options.record[options.PRIMARY_KEY],
					...options.mock,
				})
				expect(E[options.PRIMARY_KEY]).toBeDefined()
				checkResult(options.mock, E)
				return E
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}

			break

		case METHOD.DELETE:
			try {
				await options.scaffold.services.service.remove(options.record)
			} catch (e: any) {
				outputError<T>({
					error: e,
					...options,
				})
			}
	}
}

function outputError<T>(options: {
	error: any
	response?: any
	type: METHOD
	scaffold: ScaffoldDto<T>
	url?: string
	PRIMARY_KEY?: string
	data?: Partial<T> | DeepPartial<T>
	params?: any
	primaryKey?: number
	record?: T
	access_token?: string // If not provided, will use owner_access_token
	account?: Account // If not provided, will use owner_account
}): void {
	const logger = new Logger()
	const domain = `[TEST][${options.type}][${options.url}]`

	logger.error(`${domain}`, {
		response: options.response,
		request: {
			type: options.type,
			url: options.url,
			data: options.data,
			params: options.params,
			record: options.record,
			PRIMARY_KEY: options.PRIMARY_KEY,
			primaryKey: options.primaryKey,
			access_token: options.access_token,
			account: options.account,
		},
		error: options.error,
	})

	expect(options.error).toMatch('error')
}

function checkResult<T>(data: DeepPartial<T>, result: T, emitCheckResultKeys?: string[]) {
	for (const [key] of Object.entries(data)) {
		if (emitCheckResultKeys && emitCheckResultKeys.includes(key)) continue

		try {
			switch (typeof data[key]) {
				case 'object':
					continue
				case 'number':
					expect(Number(result[key]).toFixed(2)).toBe(Number(data[key]).toFixed(2))
					break
				default:
					expect(result[key]).toBe(data[key])
			}
		} catch (e: any) {
			throw new Error(`checkResult failed - ${key} issue, expected: ${data[key]} found: ${result[key]}  `)
		}
	}
}
