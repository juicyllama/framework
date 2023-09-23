import { Logger, Stopwatch } from '@juicyllama/utils'

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
	} catch (e: any) {
		logger.error(e.message, e)
		return e.stack
	}

	const time = stopwatch.stop()

	const output = {
		stopwatch: time + ' seconds',
		result: cron_result,
	}

	logger.debug(`[${domain}][CRON_FINISH]`, output)
	logger.debug(`[CRON_PERFORMANCE][${domain}] ${time} seconds`)
	return output
}
