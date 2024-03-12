// Add to imports
import axios, { AxiosInstance } from 'axios'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types'

/*
 * This function will apply the refresh token interceptor to the axios instance.
 * It will automatically refresh the access token when it expires by catching 401 errors, refreshing the token, and retrying the request with the new token
 * @param instance The axios instance to apply the interceptor to
 * @param token The token object to get and set the token
 */
export default function applyRefreshTokenInterceptor(instance: AxiosInstance) {
	const refreshTokenFunction = async () => {
		const instanceWithoutInterceptors = axios.create(instance.defaults) // Create a new instance without the interceptors to prevent infinite loops
		logger({ severity: LogSeverity.VERBOSE, message: `Refreshing access token...` })
		await instanceWithoutInterceptors.post('/auth/refresh', {}, { withCredentials: true }) // withCredentials: true is required for the refresh token cookie to be sent
		logger({ severity: LogSeverity.VERBOSE, message: `Access token refreshed` })
	}

	// Modify the response interceptor for error handling
	instance.interceptors.response.use(
		response => {
			// Success logic remains unchanged
			return response
		},
		async error => {
			const originalRequest = error.config
			if (
				error.response?.status === 401 &&
				!originalRequest._retry &&
				!originalRequest.url.includes('auth/logout')
			) {
				originalRequest._retry = true // Marking the request to prevent infinite retry loops
				try {
					await refreshTokenFunction() // Refresh the token
					return instance(originalRequest) // Retry the original request with the new token
				} catch (refreshError) {
					return Promise.reject(error) // If the refresh token fails, reject the original request and let the next interceptor handle it
				}
			}
			// Pass over to next interceptor
			return Promise.reject(error)
		},
	)
}
