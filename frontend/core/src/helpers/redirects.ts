import { Router, useRouter } from 'vue-router'
import { settingsStore } from '..'

export async function goTo(router?: Router, redirect?: string) {
	if (!router) {
		router = useRouter()
	}
	await router.push(redirect)
}

export async function goToDashboard(router?: Router) {
	if (!router) {
		router = useRouter()
	}
	await router.push(`/dashboard`)
}

export async function goToLoginRedirect(router?: Router, redirect?: string) {
	if (!router) {
		router = useRouter()
	}

	const settings = {...settingsStore?.getSettings}

	if (redirect) {
		await router.push(redirect)
	} else if (settings?.return_path) {
		settingsStore.setSettings({ return_path: null })
		await router.push(settings.return_path)
	} else {
		await router.push(`/dashboard`)
	}
}

export async function goToLogin() {
	window.location.href = `/login`
}

export async function goToAdmin(router?: Router) {
	if (!router) {
		router = useRouter()
	}
	await router.push(`/admin`)
}

export async function goToAdminUsers(router?: Router) {
	if (!router) {
		router = useRouter()
	}
	await router.push(`/admin/users`)
}

export async function goToEditAccount(router?: Router) {
	if (!router) {
		router = useRouter()
	}
	await router.push(`/admin/account`)
}
