import { Env } from '@juicyllama/utils'
import { LogSeverity, LogType } from '@/types'
import { QVueGlobals } from 'quasar'

export function logger(options: {
	severity: LogSeverity
	message: string
	q?: QVueGlobals
	timeout?: number
	object?: any
	table?: object
}) {
	if (options.severity === LogSeverity.VERBOSE && Env.IsProd()) {
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

	if (options.q) {
		options.q.notify({
			message: options.message,
			type: type,
			timeout: options.timeout ?? 10000,
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

	if (options.object && Env.IsDev()) {
		console.dir(options.object)
	}

	if (options.table && Env.IsDev()) {
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
