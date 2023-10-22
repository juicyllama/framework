import instance from './index'
import type { User } from '../types'
import type { UserLogin } from '../types'
import { logger } from '../helpers'
import { LogSeverity } from '../types'
import { useQuasar } from 'quasar'
import { userStore } from '../index'

const $q = useQuasar()

export const loginUser = async (payload: UserLogin): Promise<string> => {
	const response = await instance.post(`auth/login`, payload)
	return response.data.access_token
}

export const passwordlessLogin = async (email: string): Promise<void> => {
	return await instance.post(`auth/passwordless`, { email: email })
}

export const passwordlessLoginCode = async (email: string, code: string): Promise<string> => {
	const response = await instance.post(`auth/passwordless/code`, { email: email, code: code })
	return response.data.access_token
}

export const resetPassword = async (email: string): Promise<void> => {
	await instance.post(`auth/password-reset`, { email: email })
}

export const resetPasswordCode = async (email: string, code: string): Promise<void> => {
	await instance.post(`auth/password-reset/code`, { email: email, code: code })
}

export const resetPasswordComplete = async (email: string, code: string, pass: string): Promise<string> => {
	const response = await instance.patch(`auth/password-reset/complete`, { email: email, code: code, password: pass })
	return response.data.access_token
}

export const getUser = async (): Promise<User> => {
	const response = await instance.get(`auth/profile`)
	logger({
		severity: LogSeverity.VERBOSE,
		message: `GetUser`,
		object: response,
		table: response,
	})
	return response.data
}

export const accountAuthCheck = async (): Promise<boolean> => {
	const response = await instance.get(`auth/account/check`)
	return response.data.passed
}

export function googleLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'google')
	window.location.href = `${VITE_API_BASE_URL}/auth/google`
}

export function linkedInLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'linkedin')
	window.location.href = `${VITE_API_BASE_URL}/auth/linkedin`
}

export function microsoftLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'microsoft')
	window.location.href = `${VITE_API_BASE_URL}/auth/microsoft`
}
export function azureLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'azure_ad')
	window.location.href = `${VITE_API_BASE_URL}/auth/azure_ad`
}

export async function completeGoogleLogin(params) {
	const response = await instance.get(`auth/google/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, $q)
}

export async function completeLinkedInLogin(params) {
	const response = await instance.get(`auth/linkedin/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, $q)
}

export async function completeMicrosoftLogin(params) {
	const response = await instance.get(`auth/microsoft/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, $q)
}

export async function completeAzureLogin(params) {
	const response = await instance.get(`auth/azure_ad/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, $q)
}
