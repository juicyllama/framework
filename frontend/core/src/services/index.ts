import axios from 'axios'
import { UserStore } from '../store/user'
import { logger } from '../helpers/logger'
import { token } from '../store/token'
import { LogSeverity } from '../types'

const headers = {
	'Content-Type': 'application/json',
}

const instance = axios.create({
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
		// Any status codes that falls outside the range of 2xx cause this function to trigger
		// Do something with response error
		if (error.response.data.statusCode === 401) {
			const userStore = UserStore()
			await userStore.logout()
		}
		return Promise.reject(error)
	},
)

export default instance
