import { PublicClientApplication } from '@azure/msal-browser'
import { QVueGlobals } from 'quasar'
import { Router } from 'vue-router'
import { goToDashboard, logger } from '../helpers'
import { userStore } from '../index'
import type { User, UserLogin } from '../types'
import { LogSeverity } from '../types'
import instance from './index'

export async function loginUser(payload: UserLogin, q: QVueGlobals, router?: Router): Promise<boolean> {
	const response = await instance.post(`auth/login`, payload, { withCredentials: true }) // withCredentials: true is required for the refresh token cookie to be set

	if (response.data.error) {
		switch (response.data.error.message) {
			case 'Password requires changing':
				await router.push('/reset?email=' + payload.email + '&message=' + response.data.error.message)
				return false
			default:
				throw new Error(response.data.error.message)
		}
	} else if (response.data.access_token) {
		return true
	} else {
		throw new Error('Unknown error')
	}
}

export const passwordlessLogin = async (email: string): Promise<void> => {
	return await instance.post(`auth/passwordless`, { email: email }, { withCredentials: true })
}

export const passwordlessLoginCode = async (email: string, code: string): Promise<boolean> => {
	const response = await instance.post(`auth/passwordless/code`, { email: email, code: code, withCredentials: true })
	return response.data.access_token
}

export const resetPassword = async (email: string): Promise<void> => {
	await instance.post(`auth/password-reset`, { email: email }, { withCredentials: true })
}

export const resetPasswordCode = async (email: string, code: string): Promise<void> => {
	await instance.post(`auth/password-reset/code`, { email: email, code: code }, { withCredentials: true })
}

export const resetPasswordComplete = async (email: string, code: string, pass: string): Promise<string> => {
	const response = await instance.post(`auth/password-reset/complete`, {
		email: email,
		code: code,
		password: pass,
		withCredentials: true,
	})
	return response.data.access_token
}

export const getUser = async (): Promise<User> => {
	const response = await instance.get(`auth/profile`, { withCredentials: true })
	logger({
		severity: LogSeverity.VERBOSE,
		message: `GetUser`,
		object: response,
		table: response,
	})
	return response.data
}

export const accountAuthCheck = async (): Promise<boolean> => {
	const response = await instance.get(`auth/account/check`, { withCredentials: true })
	logger({
		severity: LogSeverity.VERBOSE,
		message: `Auth Check - ${response.data.passed}`,
		object: response.data,
	})
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

export function azureLogin(
	VITE_AZURE_AD_TENANT_ID: string,
	VITE_AZURE_AD_CLIENT_ID: string,
	VITE_AZURE_AD_EXPOSED_SCOPES: string,
	router: Router,
) {
	const scopes = VITE_AZURE_AD_EXPOSED_SCOPES.split(' ').map(scope => `api://${VITE_AZURE_AD_CLIENT_ID}/${scope}`)
	const msalConfig = {
		auth: {
			clientId: VITE_AZURE_AD_CLIENT_ID,
			authority: `https://login.microsoftonline.com/${VITE_AZURE_AD_TENANT_ID}`,
			redirectUri: 'https://local.sentinel.hiveuw.com:8080/login',
		},
		cache: {
			cacheLocation: 'localStorage', // This configures where your cache will be stored
			storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
		},
	}
	const msalInstance = new PublicClientApplication(msalConfig)
	msalInstance.initialize().then(() => {
		msalInstance.loginPopup({ scopes }).then(async (/*authResponse*/) => {
			await userStore.loadUserAndAccount()
			goToDashboard(router)
		})
	})
}

export async function completeGoogleLogin(params, q: QVueGlobals) {
	await instance.get(`auth/google/redirect`, { params: params, withCredentials: true })
	return userStore.loadUserAndAccount(q)
}

export async function completeLinkedInLogin(params, q: QVueGlobals) {
	await instance.get(`auth/linkedin/redirect`, { params: params, withCredentials: true })
	return userStore.loadUserAndAccount(q)
}
