import { Logger } from './Logger'

const logger = new Logger()

/**
 * Initialize a new stopwatch with a string representing the domain.
 *
 * Start the stopwatch with `start()` and stop it with `stop()`. Get the time in seconds with `seconds`.
 */
export class Stopwatch {
	private _start = 0
	private _end = 0
	private _domain = ''
	public seconds = 0

	constructor(domain: string) {
		this._domain = domain
	}

	start() {
		logger.log(`[${this._domain}][⏱️] Starting stopwatch`)
		this._start = performance.now()
	}

	// Returns the time in seconds
	check(): number {
		const now = performance.now()
		this.seconds = Number(((now - this._start) / 1000).toFixed(4))
		logger.log(`[${this._domain}][⏱️] Checking stopwatch: ${this.seconds}`)
		return this.seconds
	}

	// Returns the time in seconds & resets the stopwatch
	stop(): number {
		this._end = performance.now()
		this.seconds = Number(((this._end - this._start) / 1000).toFixed(4))
		const time = Number(((this._end - this._start) / 1000).toFixed(4))
		logger.log(`[${this._domain}][⏱️] Stopping stopwatch: ${time}`)
		this._start = 0
		this._end = 0
		this.seconds = 0
		return time
	}
}
