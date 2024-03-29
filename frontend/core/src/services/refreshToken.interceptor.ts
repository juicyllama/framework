// Add to imports
import { AxiosInstance } from 'axios'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types'
import { refreshToken } from './auth'

/*
 * This function will apply the refresh token interceptor to the axios instance.
 * It will automatically refresh the access token when it expires by catching 401 errors, refreshing the token, and retrying the request with the new token
 * @param instance The axios instance to apply the interceptor to
 * @param token The token object to get and set the token
 */
export default function applyRefreshTokenInterceptor(instance: AxiosInstance) {
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
					await refreshToken() // Refresh the token
					logger({ severity: LogSeverity.VERBOSE, message: `Access token refreshed` })
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
