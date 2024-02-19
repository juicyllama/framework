import { logger } from '../helpers'
import { LogSeverity } from '../types'

export const pusherCreds = {
	PUSHER_KEY: process.env.VITE_PUSHER_KEY,
	PUSHER_CHANNEL: process.env.VITE_PUSHER_CHANNEL,
}

export async function startPusher() {
	pusherCreds.PUSHER_KEY = <string>process.env.VITE_PUSHER_KEY
	pusherCreds.PUSHER_CHANNEL = <string>process.env.VITE_PUSHER_CHANNEL
}

export async function loadPusher(event: string, callback: Function): Promise<void> {
	const Pusher = await import('pusher-js')

	if (!Pusher) {
		logger({ severity: LogSeverity.WARN, message: `[Pusher] Not installed` })
		return
	}

	if (!pusherCreds.PUSHER_KEY || !pusherCreds.PUSHER_CHANNEL) {
		logger({ severity: LogSeverity.WARN, message: `[Pusher] Missing Credentials` })
		return
	}

	const pusher = new Pusher.default(pusherCreds.PUSHER_KEY, { cluster: 'eu' })
	pusher.subscribe(pusherCreds.PUSHER_CHANNEL)
	pusher.bind(event, async data => {
		logger({
			severity: LogSeverity.VERBOSE,
			message: `New pusher event: ${event}`,
			table: data,
		})
		await callback(data)
	})
	logger({ severity: LogSeverity.VERBOSE, message: `[Pusher] Listening for events: ${event}` })
}

export async function unloadPusher(event: string): Promise<void> {
	const Pusher = await import('pusher-js')

	if (!Pusher) {
		logger({ severity: LogSeverity.WARN, message: `[Pusher] Not installed` })
		return
	}

	if (!pusherCreds.PUSHER_KEY || !pusherCreds.PUSHER_CHANNEL) {
		logger({ severity: LogSeverity.WARN, message: `[Pusher] Missing Credentials` })
		return
	}

	const pusher = new Pusher.default(pusherCreds.PUSHER_KEY, { cluster: 'eu' })
	pusher.subscribe(pusherCreds.PUSHER_CHANNEL)
	pusher.unbind(event)
	logger({ severity: LogSeverity.VERBOSE, message: `[Pusher] Unbind for events: ${event}` })
}
