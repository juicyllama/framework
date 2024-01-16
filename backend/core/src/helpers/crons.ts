import { Dates, Logger, Stopwatch } from '@juicyllama/utils'

export async function CronRunner(
	domain: string,
	func: any,
): Promise<{
	stopwatch: string
	result: any
}> {
	const logger = new Logger()
	const stopwatch = new Stopwatch(domain)
	stopwatch.start()

	let cron_result

	try {
		cron_result = await func
	} catch (e) {
		const error = e as Error
		logger.error(error.message, error)
		throw e
	}

	const time = stopwatch.stop()
	const date = new Date()
	date.setSeconds(date.getSeconds() + time)
	const friendlyTime = Dates.ahead(date)

	const output = {
		stopwatch: friendlyTime,
		result: cron_result,
	}

	logger.debug(`[${domain}][CRON_FINISH]`, output)
	logger.debug(`[CRON_PERFORMANCE][${domain}] ${friendlyTime}`)
	return output
}
