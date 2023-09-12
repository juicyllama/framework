export class System {
	/**
	 * Checks if connection is offline, allows to skip calls to remote services, good for developing whilst in the air or to see how applications can cope respond without signal
	 */

	static isOffline(): boolean {
		return !!process.env.OFFLINE
	}
}
