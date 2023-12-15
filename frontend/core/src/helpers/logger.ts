import { IconSettings, LogSeverity, LogType } from '../types'
import { QVueGlobals } from 'quasar'

export function logger(options: {
	severity: LogSeverity
	message: string
	q?: QVueGlobals
	timeout?: number
	object?: any
	table?: object
	icon?: IconSettings
}) {
	if (options.severity === LogSeverity.VERBOSE && import.meta.env.NODE_ENV === 'production') {
		return
	}

	let type: LogType

	switch (options.severity) {
		case LogSeverity.LOG:
			type = LogType.POSITIVE
			break
		case LogSeverity.ERROR:
			type = LogType.NEGATIVE
			break
		case LogSeverity.WARN:
			type = LogType.WARNING
			break
		case LogSeverity.VERBOSE:
			type = LogType.INFO
			break
	}

	let icon: string

	switch (options.severity) {
		case LogSeverity.LOG:
			icon = options.icon?.icons?.success ?? 'check'
			break
		case LogSeverity.ERROR:
			icon = options.icon?.icons?.error ?? 'error'
			break
		case LogSeverity.WARN:
			icon = options.icon?.icons?.warning ?? 'warning'
			break
		case LogSeverity.VERBOSE:
			icon = options.icon?.icons?.info ?? 'info'
			break
	}

	if (options.q) {
		options.q.notify({
			message: options.message,
			type: type,
			timeout: options.timeout ?? 10000,
			icon: icon,
		})
	}

	switch (options.severity) {
		case LogSeverity.LOG:
			console.log(options.message)
			break
		case LogSeverity.ERROR:
			console.error(options.message)
			break
		case LogSeverity.WARN:
			console.warn(options.message)
			break
		case LogSeverity.VERBOSE:
			console.info(options.message)
			break
	}

	if (options.object && import.meta.env.NODE_ENV === 'development') {
		console.dir(options.object)
	}

	if (options.table && import.meta.env.NODE_ENV === 'development') {
		console.table(options.table)
	}
}

export function apiError(e): string {
	if (e.response) {
		return e.response.data.message
	} else if (e.request) {
		return e.request
	} else {
		return e.message
	}
}
