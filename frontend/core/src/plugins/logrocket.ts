import LogRocket from 'logrocket'
import { logger } from '../helpers/logger'
import { LogSeverity } from '../types/common'
import { User } from '../types/user'

export function startLogrocket(version: string) {
	if (process.env.NODE_ENV === 'production') {
		LogRocket.init(<string>process.env.VITE_LOGROCKET, {
			release: version,
		})
		logger({ severity: LogSeverity.LOG, message: `LogRocket.init` })
	}
}

export function identifyLogrocket(user: User) {
	if (process.env.NODE_ENV === 'production' && process.env.VITE_LOGROCKET) {
		if (!localStorage.getItem('logrocket')) {
			try {
				LogRocket.identify(user.user_id.toString(), {
					name: user.first_name + ' ' + user.last_name,
					email: user.email,
				})
				localStorage.setItem('logrocket', 'true')
				logger({ severity: LogSeverity.LOG, message: `LogRocket.identify` })
			} catch (e: any) {
				logger({ severity: LogSeverity.ERROR, message: e.message })
			}
		}
	}
}
