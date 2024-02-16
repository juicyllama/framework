import { Router } from 'vue-router'
import { settingsStore } from '../index'
import { logger } from './logger'
import { LogSeverity } from '../types'

export async function goTo( redirect: string, router: Router) {
	if(!redirect) {
		throw new Error(`goTo: redirect is required`)
	}
	await router.push(redirect)
}

export async function goToDashboard(router: Router) {
	await router.push(`/dashboard`)
}

export async function goToLoginRedirect(router: Router, redirect?: string) {
	const settings = { ...settingsStore?.getSettings }

	if (redirect) {
		await router.push(redirect)
	} else if (settings?.return_path) {
		settingsStore.setSettings({ return_path: null })
		await router.push(settings.return_path)
	} else {
		await router.push(`/dashboard`)
	}
}

export async function goToLogin(router: Router, redirect?: string) {
	logger({ severity: LogSeverity.VERBOSE, message: `[Helpers][goToLogin] Redirecting to /login?r=${redirect}` })

	if(redirect === '/login') {
		redirect = null
	}

	if (redirect) {
		settingsStore.setSettings({ return_path: redirect })
		await goTo(`/login?r=${redirect}`, router)
	} else {
		await goTo(`/login`, router)
	}
}

export async function goToAdmin(router: Router) {
	await router.push(`/admin`)
}

export async function goToAdminUsers(router: Router) {
	await router.push(`/admin/users`)
}

export async function goToEditAccount(router: Router) {
	await router.push(`/admin/account`)
}
