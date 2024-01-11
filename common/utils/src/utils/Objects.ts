export class Objects {
	/**
	 * Clean an object
	 */

	static clean<T extends Record<any, any>>(object: T): Partial<T> {
		Object.keys(object).forEach(key => {
			if (object[key] === undefined) {
				delete object[key]
			}

			if (object[key] === 'undefined') {
				delete object[key]
			}

			if (object[key] === '') {
				delete object[key]
			}
		})

		return object
	}
}
