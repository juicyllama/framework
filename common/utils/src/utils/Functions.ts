export class Functions {
	/**
	 * Returns the function name of the parent function
	 */

	static whoIsMyDaddy() {
		const ex = new Error()
		return (ex.stack ?? '').split('\n')[3].trim().split(' ')[1]
	}
}
