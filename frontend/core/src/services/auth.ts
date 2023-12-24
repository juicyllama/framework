import instance from './index'
import {PublicClientApplication} from "@azure/msal-browser";
import type { User } from '../types'
import type { UserLogin } from '../types'
import { logger } from '../helpers'
import { LogSeverity } from '../types'
import { QVueGlobals } from 'quasar'
import { token, userStore } from '../index'
import { Router } from 'vue-router'


const AZURE_AD_TENANT_ID = process.env.VITE_AZURE_AD_TENANT_ID || import.meta.env.VITE_AZURE_AD_TENANT_ID
const AZURE_AD_CLIENT_ID = process.env.VITE_AZURE_AD_CLIENT_ID || import.meta.env.VITE_AZURE_AD_CLIENT_ID

const msalConfig = {
    auth: {
        clientId: AZURE_AD_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${AZURE_AD_TENANT_ID}`,
        redirectUri: "https://local.sentinel.hiveuw.com:8080/login"
    },
	cache: {
		cacheLocation: 'localStorage', // This configures where your cache will be stored
		storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
	}
};

const msalInstance = new PublicClientApplication(msalConfig);
msalInstance.initialize();

export async function loginUser(payload: UserLogin, q: QVueGlobals, router?: Router): Promise<string> {
	const response = await instance.post(`auth/login`, payload)

	if(response.data.error) {
		switch(response.data.error.message) {
			case 'Password requires changing':
				await router.push('/reset?email=' + payload.email+'&message='+response.data.error.message)
				return
			default:
				throw new Error(response.data.error.message)
		}
	}
	else if(response.data.access_token){
		return response.data.access_token
	}
	else {
		throw new Error('Unknown error')
	}
	
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
	const response = await instance.post(`auth/password-reset/complete`, { email: email, code: code, password: pass })
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

export function microsoftLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'microsoft')
	window.location.href = `${VITE_API_BASE_URL}/auth/microsoft`
}
export function azureLogin(VITE_API_BASE_URL: string) {
	localStorage.setItem('OAuthType', 'azure_ad')
	msalInstance.loginPopup({
		scopes: [`api://${AZURE_AD_CLIENT_ID}/User.Read`],
	}).then(async (authResponse) => {
		const accessToken = authResponse.accessToken;
		token.set(accessToken)
		await instance.get(`auth/azure_ad/redirect`)
		userStore.processAccessToken(accessToken)
	});
}

export async function completeGoogleLogin(params, q: QVueGlobals) {
	const response = await instance.get(`auth/google/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, q)
}

export async function completeLinkedInLogin(params, q: QVueGlobals) {
	const response = await instance.get(`auth/linkedin/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, q)
}

export async function completeMicrosoftLogin(params, q: QVueGlobals) {
	const response = await instance.get(`auth/microsoft/redirect`, { params: params })
	return userStore.processAccessToken(response.data.access_token, q)
}

export async function completeAzureLogin(params, q: QVueGlobals) {
	const response = await instance.get(`auth/azure_ad`, { params: params })
	userStore.processAccessToken(response.data.access_token, q)
	await instance.get(`auth/azure_ad/redirect`)
}
