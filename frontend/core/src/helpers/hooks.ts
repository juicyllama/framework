import { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import { accountStore, logger, LogSeverity, userStore } from '../index'
import { subscribeWebsocket } from '../services/websockets'

export async function AuthHook(router: Router, route: RouteLocationNormalizedLoaded) {
	if (!userStore.user) {
		logger({
			severity: LogSeverity.VERBOSE,
			message: `[HOOK] Auth: failed, redirecting to /login?r=${route.fullPath}`,
		})
		window.location.href = `/login?r=${route.fullPath}`
	}
	await userStore.accountCheck(router, route.fullPath)
}
export async function GlobalSubscriptionHook() {
	logger({ severity: LogSeverity.VERBOSE, message: `[HOOK] GlobalSubscription` })
	const event = `account_${accountStore.getAccountId}`
	subscribeWebsocket(event, async event => {
		await accountStore.resyncAccount(event.account_id)
	})
}
