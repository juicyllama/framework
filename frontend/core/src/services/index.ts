import axios, { AxiosInstance } from 'axios'
import { UserStore } from '../store/user'
import { logger } from '../helpers/logger'
import { token } from '../store/token'
import { LogSeverity } from '../types'
import applyRefreshTokenInterceptor from './refreshToken.interceptor'

const headers = {
	'Content-Type': 'application/json',
}

const instance: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	headers,
})

const user_token = token.get()
if (user_token) {
	instance.defaults.headers.common['Authorization'] = 'Bearer ' + user_token
}

instance.interceptors.request.use(config => {
	let message = `[${config.method}] ${config.url}`

	if (config.data) {
		message += ` => ${JSON.stringify(config.data)}`
	}

	logger({ severity: LogSeverity.VERBOSE, message: message })
	return config
})

// Add the refresh token interceptor.
// This will automatically refresh the access token when it expires by catching 401 errors, refreshing the token, and retrying the request with the new token
applyRefreshTokenInterceptor(instance, token)

instance.interceptors.response.use(
	response => {
		// Any status code that lie within the range of 2xx cause this function to trigger
		// Do something with response data

		if (response.config.method === 'get') {
			if (import.meta.env.NODE_ENV === 'development') {
				console.table(response.data)
			}
		}

		logger({ severity: LogSeverity.VERBOSE, message: `[RESPONSE] ${JSON.stringify(response.data)}` })
		return response
	},
	async error => {
		logger({ severity: LogSeverity.ERROR, message: `${error.message}` })
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error

		//alert(JSON.stringify(error.response?.data))
		switch (error.response?.data?.statusCode) {
			case 401:
				//if route is /login return error otherwise logout
				if (window.location.pathname === '/login') {
					return {
						data: {
							error: {
								message: 'Login failed, please try again!',
							},
						},
					}
				} else {
					// if the refresh token is expired, log the user out
					const userStore = UserStore()
					await userStore.logout()
				}
				break
			case 403:
				return {
					data: {
						error: {
							message: error.response.data.message,
							status: error.response.data.statusCode,
						},
					},
				}

			default:
				return Promise.reject(error)
		}
	},
)

export default instance
