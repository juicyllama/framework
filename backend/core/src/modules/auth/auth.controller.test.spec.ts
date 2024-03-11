import { faker } from '@faker-js/faker'
import request from 'supertest'
import { Scaffold, ScaffoldDto, TestService } from '../../test'
import { METHOD } from '../../types'
import { PRIMARY_KEY } from '../users/users.constants'
import { AuthModule } from './auth.module'
import { AuthService } from './auth.service'
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME } from './auth.constants'
import { castArray } from 'lodash'
import { UserAccount } from './user-account.entity'

const E = UserAccount
type T = UserAccount
const MODULE = AuthModule
const SERVICE = AuthService
const url = '/auth'
const new_password = faker.internet.password({
	length: 20,
	memorable: false,
	pattern: /[!-~]/,
})

export function getCookieValueFromHeader(res: any, cookieName: string) {
	const cookies: Array<string> = castArray(res.headers['set-cookie'])
	const cookie = cookies.find(cookie => cookie.startsWith(cookieName + '='))
	return cookie?.split('=')[1].split(';')[0]
}

let refreshToken: string | undefined

describe('Auth Endpoints', () => {
	const scaffolding = new Scaffold<T>()
	let scaffold: ScaffoldDto<T>

	beforeAll(async () => {
		scaffold = await scaffolding.up(MODULE, SERVICE)
	})

	describe('Login', () => {
		it('Sets new access token and refresh token cookies', async () => {
			await request(scaffold.server)
				.post(`${url}/login`)
				.send({
					email: scaffold.values.owner.email,
					password: scaffold.values.owner_password,
				})
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						refreshToken = getCookieValueFromHeader(res, REFRESH_TOKEN_COOKIE_NAME) // cookie token
						expect(res.body.access_token).toBeDefined() // bearer token
						expect(accessToken).toBeDefined()
						scaffold.values.owner_access_token = accessToken || ''
					} catch (e) {
						console.error(res.headers)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					expect(e).toMatch('error')
				})
		})
	})

	describe('Refresh', () => {
		it('Sets new access token and refresh token cookies', async () => {
			await request(scaffold.server)
				.post(`${url}/refresh`)
				.set('Cookie', `${REFRESH_TOKEN_COOKIE_NAME}=${refreshToken}`)
				.send({})
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						expect(res.body.access_token).toBeDefined() // bearer token
						expect(accessToken).toBeDefined()
						scaffold.values.owner_access_token = accessToken || ''
					} catch (e) {
						console.error(res.headers)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					expect(e).toMatch('error')
				})
		})
	})

	describe('Token-to-cookie', () => {
		it('Sets new access token and refresh token cookies', async () => {
			await request(scaffold.server)
				.post(`${url}/token-to-cookie`)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
				})
				.send({})
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						expect(res.body.access_token).toBeDefined() // bearer token
						expect(accessToken).toBeDefined()
						scaffold.values.owner_access_token = accessToken || ''
					} catch (e) {
						console.error(res.headers)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					expect(e).toMatch('error')
				})
		})
	})

	describe('Logout', () => {
		it('Clears access token and refresh token cookies', async () => {
			await request(scaffold.server)
				.post(`${url}/logout`)
				.set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${scaffold.values.owner_access_token}`)
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						const refreshToken = getCookieValueFromHeader(res, REFRESH_TOKEN_COOKIE_NAME) // cookie token
						expect(accessToken).toBeFalsy()
						expect(refreshToken).toBeFalsy()
						expect(res.body.success).toBeTruthy()
					} catch (e) {
						console.error(res.headers)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					expect(e).toMatch('error')
				})
		})
	})

	describe('Profile', () => {
		it('Get Profile', async () => {
			await TestService<T>({
				type: METHOD.GET,
				scaffold: scaffold,
				mock: {
					user_id: scaffold.values.owner.user_id,
				},
				PRIMARY_KEY: PRIMARY_KEY,
			})
		})

		it('Account Check (cookie)', async () => {
			await request(scaffold.server)
				.get(`${url}/account/check`)
				.set('Cookie', `${ACCESS_TOKEN_COOKIE_NAME}=${scaffold.values.owner_access_token}`)
				.set({
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.then(async ({ body }) => {
					try {
						expect(body.passed).toBeTruthy()
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})

		it('Account Check (Bearer)', async () => {
			await request(scaffold.server)
				.get(`${url}/account/check`)
				.set({
					Authorization: 'Bearer ' + scaffold.values.owner_access_token,
					'account-id': scaffold.values.account.account_id.toString(),
				})
				.then(async ({ body }) => {
					try {
						expect(body.passed).toBeTruthy()
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	describe('Password Reset', () => {
		it('Password Reset - Start', async () => {
			await request(scaffold.server)
				.post(`${url}/password-reset`)
				.send({
					email: scaffold.values.owner.email,
				})
				.then(async ({ body }) => {
					try {
						expect(body.success).toBeTruthy()
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})

		it('Password Reset - Code', async () => {
			const code = await scaffold.services.authService.getValidationCode(scaffold.values.owner)

			await request(scaffold.server)
				.post(`${url}/password-reset/code`)
				.send({
					email: scaffold.values.owner.email,
					code: code,
				})
				.then(async ({ body }) => {
					try {
						expect(body.success).toBeTruthy()
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})

		it('Password Reset - Complete', async () => {
			const code = await scaffold.services.authService.getValidationCode(scaffold.values.owner)

			await request(scaffold.server)
				.post(`${url}/password-reset/complete`)
				.send({
					email: scaffold.values.owner.email,
					code: code,
					password: new_password,
				})
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						expect(accessToken).toBeTruthy()
						expect(res.body.access_token).toBeTruthy() // bearer token
					} catch (e) {
						console.error(res.headers)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	describe('Passwordless', () => {
		it('Passwordless - Start', async () => {
			await request(scaffold.server)
				.post(`${url}/passwordless`)
				.send({
					email: scaffold.values.owner.email,
				})
				.then(async ({ body }) => {
					try {
						expect(body.success).toBeTruthy()
					} catch (e) {
						console.error(body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})

		it('Passwordless - Code', async () => {
			const code = await scaffold.services.authService.getValidationCode(scaffold.values.owner)

			await request(scaffold.server)
				.post(`${url}/passwordless/code`)
				.send({
					email: scaffold.values.owner.email,
					code: code,
				})
				.then(async res => {
					try {
						const accessToken = getCookieValueFromHeader(res, ACCESS_TOKEN_COOKIE_NAME) // cookie token
						expect(res.body.access_token).toBeTruthy()
						expect(accessToken).toBeTruthy() // bearer token
					} catch (e) {
						console.error(res.body)
						expect(e).toMatch('error')
					}
				})
				.catch(async e => {
					console.error(e)
					expect(e).toMatch('error')
				})
		})
	})

	afterAll(async () => {
		await scaffolding.down(E)
	})
})
