import Bugsnag from '@bugsnag/js'
import BugsnagPluginVue from '@bugsnag/plugin-vue'
import BugsnagPerformance from '@bugsnag/browser-performance'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types/common'
import { User } from '../types/user'


export function startBugsnag(version: string) {
	Bugsnag.start({
		apiKey: <string>process.env.VITE_BUGSNAG,
		plugins: [new BugsnagPluginVue()],
		releaseStage: process.env.NODE_ENV,
		onError: function (event) {
			event.addMetadata('app', {
				version,
			})
		},
	})
	BugsnagPerformance.start({ apiKey: <string>process.env.VITE_BUGSNAG })
	return Bugsnag.getPlugin('vue')
}

export function identifyBugsnag(user: User) {
	if (!localStorage.getItem('bugsnag')) {
		try {
			Bugsnag.setUser(user.user_id.toString(), user.email, `${user.first_name} ${user.last_name}`)
			localStorage.setItem('bugsnag', 'true')
			logger({ severity: LogSeverity.LOG, message: `Bugsnag.identify` })
		} catch (e: any) {
			logger({ severity: LogSeverity.ERROR, message: e.message })
		}
	}
}
