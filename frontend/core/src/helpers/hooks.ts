import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { accountStore, logger, LogSeverity, token, userStore } from '../index'

export async function AuthHook(router: Router, route: RouteLocationNormalizedLoaded) {
	if (!userStore.user || !token.get()) {
		logger({ severity: LogSeverity.VERBOSE, message: `[HOOK] Auth: failed, redirecting to /login?r=${route.fullPath}` })
		window.location.href = `/login?r=${route.fullPath}`
	}
	await userStore.accountCheck(router, route.fullPath)	

}
export async function GlobalSubscriptionHook(secrets: any) {
	logger({ severity: LogSeverity.VERBOSE, message: `[HOOK] GlobalSubscription` })

	const Pusher = await import('pusher-js')

	if (Pusher) {
		const key = secrets.VITE_PUSHER_KEY
		const channel = secrets.VITE_PUSHER_CHANNEL
		const event = `account_${accountStore.getAccountId}`

		if (key && channel) {
			const pusher = new Pusher.default(key, { cluster: 'eu' })
			pusher.subscribe(channel)
			pusher.bind(event, async event => {
				await accountStore.resyncAccount(event.account_id)
			})
			logger({ severity: LogSeverity.VERBOSE, message: `Pusher listening for events: ${event}` })
		} else {
			logger({ severity: LogSeverity.WARN, message: `Missing Pusher Credentials` })
		}
	} else {
		logger({ severity: LogSeverity.WARN, message: `Pusher not installed` })
	}
}
