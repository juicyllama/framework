// Add to imports
import { AxiosInstance } from 'axios'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types'

export default function applyRefreshTokenInterceptor(
	instance: AxiosInstance,
	token: { get: () => string; set: (token: string) => void },
) {
	// Assuming refreshTokenFunction is an async function that handles token refresh
	// and updates the token in storage and Axios headers.
	async function refreshTokenFunction() {
		// Implement the refresh token logic here. This should include:
		// 1. Sending a request to your refresh token endpoint.
		// 2. Updating the stored token upon success.
		// 3. Updating the Axios default header with the new token.
		try {
			logger({ severity: LogSeverity.VERBOSE, message: `Refreshing access token...` })
			const response = await instance.post('/auth/refresh', {}, { withCredentials: true })
			const newAccessToken = response.data.access_token
			logger({ severity: LogSeverity.VERBOSE, message: `Access token refreshed` })
			token.set(newAccessToken) // Assuming you have a mechanism to update the token in storage.
			instance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken
			return newAccessToken
		} catch (error) {
			// Handle error, possibly redirect to login or log out the user
			throw error
		}
	}

	// Modify the response interceptor for error handling
	instance.interceptors.response.use(
		response => {
			// Success logic remains unchanged
			return response
		},
		async error => {
			const originalRequest = error.config
			if (error.response?.status === 401 && !originalRequest._retry) {
				originalRequest._retry = true // Marking the request to prevent infinite retry loops
				try {
					const newAccessToken = await refreshTokenFunction() // Refresh the token
					originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken // Update the original request with the new token
					return instance(originalRequest) // Retry the original request with the new token
				} catch (refreshError) {
					// Handle failed refresh (e.g., redirect to login)
				}
			}
			// Handle other errors
			return Promise.reject(error)
		},
	)
}
